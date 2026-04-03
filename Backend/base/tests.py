from decimal import Decimal
from datetime import timedelta

from django.core import mail
from django.test import override_settings
from django.urls import reverse
from django.utils.timezone import now
from rest_framework import status
from rest_framework.test import APITestCase

from auth_api.models import User
from base.models import Order, OrderItem, Product, ShippingAddress


@override_settings(EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend")
class OrderFlowTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            name="Customer",
            email="customer@example.com",
            password="pass1234",
        )
        self.user.is_active = True
        self.user.save()

        self.admin = User.objects.create_superuser(
            name="Admin",
            email="admin@example.com",
            password="admin1234",
        )

        self.product = Product.objects.create(
            user=self.admin,
            name="Test Product",
            brand="Brand",
            category="Category",
            description="Test description",
            price=Decimal("100.00"),
            countInStock=10,
        )

        self.order_list_url = "/api/orders/"
        self.admin_stats_url = "/api/admin/stats/"

    def authenticate_user(self):
        self.client.force_authenticate(user=self.user)

    def authenticate_admin(self):
        self.client.force_authenticate(user=self.admin)

    def create_order(self, payment_method="SSLCommerz", quantity=2):
        self.authenticate_user()
        payload = {
            "paymentMethod": payment_method,
            "taxPrice": "10.00",
            "shippingPrice": "15.00",
            "totalPrice": "225.00",
            "orderItems": [
                {
                    "id": self.product.id,
                    "quantity": quantity,
                    "price": "100.00",
                }
            ],
            "shippingAddress": {
                "address": "123 Test Street",
                "city": "Dhaka",
                "postalCode": "1207",
                "country": "Bangladesh",
            },
        }
        with self.captureOnCommitCallbacks(execute=True):
            response = self.client.post(self.order_list_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        return Order.objects.get(id=response.data["id"])

    def test_create_order_reduces_stock_and_sets_expiry(self):
        order = self.create_order(quantity=3)

        self.product.refresh_from_db()

        self.assertEqual(order.status, "pending")
        self.assertFalse(order.isPaid)
        self.assertEqual(self.product.countInStock, 7)
        self.assertIsNotNone(order.expiresAt)
        self.assertEqual(OrderItem.objects.filter(order=order).count(), 1)
        self.assertTrue(ShippingAddress.objects.filter(order=order).exists())
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn("placed successfully", mail.outbox[0].subject.lower())

    def test_pay_marks_order_as_paid_status(self):
        order = self.create_order()
        self.authenticate_user()

        response = self.client.put(f"/api/orders/{order.id}/pay/", {}, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        order.refresh_from_db()
        self.assertTrue(order.isPaid)
        self.assertEqual(order.status, "paid")
        self.assertIsNotNone(order.paidAt)

    def test_expired_order_auto_cancels_restores_stock_and_sends_email(self):
        order = self.create_order(quantity=2)
        order.expiresAt = now() - timedelta(minutes=31)
        order.save(update_fields=["expiresAt"])
        mail.outbox = []

        self.authenticate_user()
        with self.captureOnCommitCallbacks(execute=True):
            response = self.client.get(self.order_list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        order.refresh_from_db()
        self.product.refresh_from_db()

        self.assertEqual(order.status, "cancelled")
        self.assertEqual(self.product.countInStock, 10)
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn("cancelled", mail.outbox[0].subject.lower())

    def test_mark_returned_before_delivery_restores_stock_and_sends_email(self):
        order = self.create_order(quantity=2)
        mail.outbox = []

        self.authenticate_admin()
        with self.captureOnCommitCallbacks(execute=True):
            response = self.client.put(
                f"/api/orders/{order.id}/mark-returned/",
                {},
                format="json",
            )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        order.refresh_from_db()
        self.product.refresh_from_db()

        self.assertEqual(order.status, "returned")
        self.assertEqual(self.product.countInStock, 10)
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn("returned", mail.outbox[0].subject.lower())

    def test_mark_returned_cannot_restore_stock_twice(self):
        order = self.create_order(quantity=2)

        self.authenticate_admin()
        first_response = self.client.put(
            f"/api/orders/{order.id}/mark-returned/",
            {},
            format="json",
        )
        second_response = self.client.put(
            f"/api/orders/{order.id}/mark-returned/",
            {},
            format="json",
        )

        self.assertEqual(first_response.status_code, status.HTTP_200_OK)
        self.assertEqual(second_response.status_code, status.HTTP_400_BAD_REQUEST)
        self.product.refresh_from_db()
        self.assertEqual(self.product.countInStock, 10)

    def test_admin_stats_only_count_successful_delivered_revenue(self):
        delivered_order = self.create_order(quantity=1)
        returned_order = self.create_order(quantity=1)
        cancelled_order = self.create_order(quantity=1)

        delivered_order.status = "delivered"
        delivered_order.isDelivered = True
        delivered_order.isPaid = True
        delivered_order.paidAt = now()
        delivered_order.deliveredAt = now()
        delivered_order.totalPrice = Decimal("115.00")
        delivered_order.save()

        returned_order.status = "returned"
        returned_order.isDelivered = True
        returned_order.isPaid = True
        returned_order.paidAt = now()
        returned_order.deliveredAt = now()
        returned_order.totalPrice = Decimal("215.00")
        returned_order.save()

        cancelled_order.status = "cancelled"
        cancelled_order.isDelivered = False
        cancelled_order.isPaid = False
        cancelled_order.totalPrice = Decimal("315.00")
        cancelled_order.save()

        self.authenticate_admin()
        response = self.client.get(self.admin_stats_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["orders"], 3)
        self.assertEqual(response.data["delivered"], 1)
        self.assertEqual(response.data["returned"], 1)
        self.assertEqual(response.data["cancelled"], 1)
        self.assertEqual(response.data["pending"], 0)
        self.assertEqual(Decimal(str(response.data["revenue"])), Decimal("115.00"))

    def test_cannot_pay_for_cancelled_order(self):
        order = self.create_order()
        order.status = "cancelled"
        order.save(update_fields=["status"])

        self.authenticate_user()
        response = self.client.put(f"/api/orders/{order.id}/pay/", {}, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        order.refresh_from_db()
        self.assertFalse(order.isPaid)
