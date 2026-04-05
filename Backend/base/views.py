from datetime import timedelta

from django.conf import settings
from django.contrib.auth import get_user_model
from django.shortcuts import redirect
from django.db import transaction
from django.utils.timezone import now
import requests
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status, viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import *
from .emails import (
    send_order_delivered_email,
    send_order_placed_email,
    send_order_returned_email,
)
from .paginations import MyPagination
from .serializers import (
    CartItemSerializer,
    CartItemWriteSerializer,
    OrderSerializer,
    ProductImageSerializer,
    ProductSerializer,
    ReviewImageSerializer,
    ReviewSerializer,
)
from auth_api.serializers import UserSerializer
# multiperserar
from rest_framework.parsers import MultiPartParser, FormParser


User = get_user_model()


class UserView(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminUser]

    @action(detail=True, methods=["put"], permission_classes=[IsAdminUser])
    def toggle_admin(self, request, pk=None):
        user = self.get_object()
        user.is_staff = not user.is_staff
        user.save()
        return Response({"is_staff": user.is_staff})


@api_view(["GET"])
@permission_classes([IsAdminUser])
def admin_stats(request):
    total_users = User.objects.count()
    total_products = Product.objects.count()
    total_orders = Order.objects.count()
    successful_orders = Order.objects.filter(status="delivered", isDelivered=True)
    total_revenue = sum(order.totalPrice for order in successful_orders if order.totalPrice)
    total_stock = sum(product.countInStock or 0 for product in Product.objects.all())
    delivered_orders = successful_orders.count()
    cancelled_orders = Order.objects.filter(status="cancelled").count()
    returned_orders = Order.objects.filter(status="returned").count()
    pending_orders = Order.objects.filter(status="pending").count()

    return Response(
        {
            "users": total_users,
            "products": total_products,
            "orders": total_orders,
            "revenue": total_revenue,
            "total_stock": total_stock,
            "delivered": delivered_orders,
            "cancelled": cancelled_orders,
            "returned": returned_orders,
            "pending": pending_orders,
        }
    )


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def cart_items(request):
    if request.method == "GET":
        items = CartItem.objects.filter(user=request.user).select_related("product")
        serializer = CartItemSerializer(items, many=True, context={"request": request})
        return Response(serializer.data)

    serializer = CartItemWriteSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    product_id = serializer.validated_data["product_id"]
    quantity = serializer.validated_data["quantity"]

    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response({"detail": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

    if quantity > product.countInStock:
        return Response(
            {"detail": "Requested quantity is not available in stock"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    cart_item, _ = CartItem.objects.update_or_create(
        user=request.user,
        product=product,
        defaults={"quantity": quantity},
    )

    return Response(
        CartItemSerializer(cart_item, context={"request": request}).data,
        status=status.HTTP_200_OK,
    )


@api_view(["PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def cart_item_detail(request, product_id):
    try:
        cart_item = CartItem.objects.select_related("product").get(
            user=request.user,
            product_id=product_id,
        )
    except CartItem.DoesNotExist:
        return Response({"detail": "Cart item not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "PATCH":
        quantity = request.data.get("quantity")

        try:
            quantity = int(quantity)
        except (TypeError, ValueError):
            return Response(
                {"detail": "Quantity must be a valid number"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if quantity < 1:
            return Response(
                {"detail": "Quantity must be at least 1"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if quantity > cart_item.product.countInStock:
            return Response(
                {"detail": "Requested quantity is not available in stock"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        cart_item.quantity = quantity
        cart_item.save()

        return Response(CartItemSerializer(cart_item, context={"request": request}).data)

    cart_item.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def clear_cart(request):
    CartItem.objects.filter(user=request.user).delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def sync_cart(request):
    items = request.data.get("items", [])

    if not isinstance(items, list):
        return Response({"detail": "Items must be a list"}, status=status.HTTP_400_BAD_REQUEST)

    for item in items:
        serializer = CartItemWriteSerializer(data=item)
        serializer.is_valid(raise_exception=True)

        product_id = serializer.validated_data["product_id"]
        quantity = serializer.validated_data["quantity"]

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            continue

        if quantity > product.countInStock:
            quantity = product.countInStock

        if quantity < 1:
            continue

        CartItem.objects.update_or_create(
            user=request.user,
            product=product,
            defaults={"quantity": quantity},
        )

    saved_items = CartItem.objects.filter(user=request.user).select_related("product")
    return Response(
        CartItemSerializer(saved_items, many=True, context={"request": request}).data
    )


class ProductView(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    authentication_classes = [JWTAuthentication]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["category", "brand"]
    search_fields = ["name", "brand", "category"]
    ordering_fields = ["price", "rating", "numReviews", "countInStock", "createdAt"]
    pagination_class = MyPagination

    @action(detail=False, methods=["get"], url_path="top")
    def top_products(self, request):
        products = Product.objects.all().order_by("-rating", "-numReviews")[:5]
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="filters")
    def filters(self, request):
        categories = [
            value
            for value in Product.objects.order_by("category")
            .values_list("category", flat=True)
            .distinct()
            if value
        ]
        brands = [
            value
            for value in Product.objects.order_by("brand")
            .values_list("brand", flat=True)
            .distinct()
            if value
        ]

        return Response(
            {
                "categories": categories,
                "brands": brands,
            }
        )

    def get_permissions(self):
        if self.action in ["list", "retrieve", "top_products", "filters"]:
            return [AllowAny()]
        return [IsAdminUser()]


class ProductImageView(viewsets.ModelViewSet):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer
    authentication_classes = [JWTAuthentication]
    parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]
        return [IsAdminUser()]


class ReviewView(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        data = self.request.data
        try:
            product_id = int(data.get("product"))
        except (TypeError, ValueError):
            raise ValidationError({"detail": "A valid product is required"})

        order_id = data.get("order")

        if order_id:
            try:
                order_id = int(order_id)
            except (TypeError, ValueError):
                raise ValidationError({"detail": "A valid order is required"})

            try:
                selected_order = Order.objects.get(
                    id=order_id,
                    user=user,
                    isDelivered=True,
                    orderitems__product_id=product_id,
                )
            except Order.DoesNotExist:
                raise ValidationError(
                    {"detail": "You can only review products from your delivered orders"}
                )

            already_reviewed = Review.objects.filter(
                user=user,
                product_id=product_id,
                order=selected_order,
            ).exists()

            if already_reviewed:
                raise ValidationError(
                    {"detail": "You already reviewed this product for this order"}
                )
        else:
            orders = Order.objects.filter(
                user=user,
                isDelivered=True,
                orderitems__product_id=product_id,
            ).distinct()

            if not orders.exists():
                raise ValidationError({"detail": "You can only review purchased products"})

            selected_order = None

            for order in orders:
                already_reviewed = Review.objects.filter(
                    user=user,
                    product_id=product_id,
                    order=order,
                ).exists()

                if not already_reviewed:
                    selected_order = order
                    break

            if not selected_order:
                raise ValidationError(
                    {"detail": "You already reviewed all your purchases"}
                )

        review = serializer.save(
            user=user,
            name=user.name,
            order=selected_order,
        )

        product = review.product
        reviews = product.reviews.all()
        product.numReviews = reviews.count()
        product.rating = (
            sum(review.rating for review in reviews) / product.numReviews
            if product.numReviews > 0
            else 0
        )
        product.save()


class ReviewImageView(viewsets.ModelViewSet):
    queryset = ReviewImage.objects.all()
    serializer_class = ReviewImageSerializer
    parser_classes = [MultiPartParser, FormParser]


class OrderView(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def _cancel_expired_orders(self, queryset):
        expired_orders = queryset.filter(
            status="pending",
            isPaid=False,
            expiresAt__lt=now(),
        )

        for order in expired_orders:
            order.cancel_if_expired()

    def get_queryset(self):
        user = self.request.user

        if user.is_staff:
            return Order.objects.all().order_by("-createdAt")

        return Order.objects.filter(user=user).order_by("-createdAt")

    def list(self, request, *args, **kwargs):
        self._cancel_expired_orders(self.filter_queryset(self.get_queryset()))
        return super().list(request, *args, **kwargs)

    def perform_create(self, serializer):
        data = self.request.data
        user = self.request.user
        order_items = data.get("orderItems", [])

        if not order_items:
            raise ValidationError({"detail": "No order items"})

        shipping_address = data.get("shippingAddress") or {}
        required_shipping_fields = ["address", "city", "postalCode", "country"]
        missing_fields = [
            field for field in required_shipping_fields if not shipping_address.get(field)
        ]
        if missing_fields:
            raise ValidationError(
                {"detail": f"Missing shipping fields: {', '.join(missing_fields)}"}
            )

        validated_items = []

        with transaction.atomic():
            for item in order_items:
                product_id = item.get("id")
                quantity = item.get("quantity")

                try:
                    quantity = int(quantity)
                except (TypeError, ValueError):
                    raise ValidationError({"detail": "Item quantity must be a valid number"})

                if quantity < 1:
                    raise ValidationError({"detail": "Item quantity must be at least 1"})

                try:
                    product = Product.objects.select_for_update().get(id=product_id)
                except Product.DoesNotExist:
                    raise ValidationError({"detail": f"Product {product_id} was not found"})

                if quantity > product.countInStock:
                    raise ValidationError(
                        {"detail": f"Requested quantity is not available for {product.name}"}
                    )

                validated_items.append((item, product, quantity))

            order = serializer.save(
                user=user,
                expiresAt=now() + timedelta(minutes=1),
            )

            ShippingAddress.objects.create(
                order=order,
                address=shipping_address["address"],
                city=shipping_address["city"],
                postalCode=shipping_address["postalCode"],
                country=shipping_address["country"],
                shippingPrice=data.get("shippingPrice", 0),
            )

            for item, product, quantity in validated_items:
                image_url = ""
                if product.images.exists():
                    image_url = self.request.build_absolute_uri(
                        product.images.first().image.url
                    )

                OrderItem.objects.create(
                    product=product,
                    order=order,
                    name=product.name,
                    qty=quantity,
                    price=item["price"],
                    image=image_url,
                )

                product.countInStock -= quantity
                product.save()

            transaction.on_commit(lambda: send_order_placed_email(order))

    def retrieve(self, request, *args, **kwargs):
        order = self.get_object()
        order.cancel_if_expired()

        if request.user.is_staff or order.user == request.user:
            serializer = self.get_serializer(order)
            return Response(serializer.data)

        return Response({"detail": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)

    @action(detail=True, methods=["put"], permission_classes=[IsAuthenticated])
    def pay(self, request, pk=None):
        order = self.get_object()
        if order.status in ["cancelled", "returned"]:
            return Response(
                {"detail": f"Cannot pay for an order that is already {order.status}."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        order.isPaid = True
        order.paidAt = now()
        if not order.isDelivered:
            order.status = "paid"
        order.save()
        return Response({"message": "Order paid"})

    @action(detail=True, methods=["put"], permission_classes=[IsAdminUser])
    def deliver(self, request, pk=None):
        order = self.get_object()
        if order.status in ["cancelled", "returned"]:
            return Response(
                {"detail": f"Cannot deliver an order that is already {order.status}."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        order.isDelivered = True
        order.deliveredAt = now()
        order.status = "delivered"

        if not order.isPaid:
            order.isPaid = True
            order.paidAt = now()

        order.save()
        transaction.on_commit(lambda: send_order_delivered_email(order))
        return Response({"message": "Order delivered & paid"})

    @action(detail=True, methods=["put"], permission_classes=[IsAdminUser], url_path="mark-returned")
    def mark_returned(self, request, pk=None):
        order = self.get_object()

        if order.status == "cancelled":
            return Response(
                {"detail": "Cancelled orders cannot be marked as returned."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if order.status == "returned":
            return Response(
                {"detail": "Order is already marked as returned."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        with transaction.atomic():
            order = Order.objects.select_for_update().prefetch_related("orderitems__product").get(
                pk=order.pk
            )

            if order.status == "returned":
                return Response(
                    {"detail": "Order is already marked as returned."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            order.restore_stock()
            order.status = "returned"
            order.save(update_fields=["status", "updatedAt"])

        transaction.on_commit(lambda: send_order_returned_email(order))
        return Response({"message": "Order marked as returned"})

    @action(detail=True, methods=["post"])
    def ssl_init(self, request, pk=None):
        order = self.get_object()
        url = "https://sandbox.sslcommerz.com/gwprocess/v4/api.php"

        data = {
            "store_id": settings.SSLCOMMERZ_STORE_ID,
            "store_passwd": settings.SSLCOMMERZ_STORE_PASS,
            "total_amount": float(order.totalPrice),
            "currency": "BDT",
            "tran_id": str(order.id),
            "success_url": f"{settings.BACKEND_URL}/api/orders/{order.id}/ssl_success/",
            "fail_url": f"{settings.BACKEND_URL}/api/orders/{order.id}/ssl_fail/",
            "cancel_url": f"{settings.BACKEND_URL}/api/orders/{order.id}/ssl_cancel/",
            "cus_name": request.user.name,
            "cus_email": request.user.email,
            "cus_add1": order.shippingaddress.address,
            "cus_city": order.shippingaddress.city,
            "cus_country": order.shippingaddress.country,
            "shipping_method": "NO",
            "product_name": "Order Payment",
            "product_category": "General",
            "product_profile": "general",
        }

        res = requests.post(url, data=data)
        response_data = res.json()

        if "GatewayPageURL" not in response_data:
            return Response(
                {"error": "SSL init failed", "details": response_data},
                status=400,
            )

        return Response({"url": response_data["GatewayPageURL"]})

    @action(
        detail=True,
        methods=["get", "post"],
        url_path="ssl_success",
        permission_classes=[],
    )
    def ssl_success(self, request, pk=None):
        try:
            order = Order.objects.get(id=pk)
            order.isPaid = True
            order.status = "pending"
            order.paidAt = now()
            order.save()
        except Exception as exc:
            print("SSL success error:", str(exc))

        return redirect(f"{settings.FRONTEND_URL}/order/{pk}?status=success")

    @action(
        detail=True,
        methods=["get", "post"],
        url_path="ssl_fail",
        permission_classes=[],
    )
    def ssl_fail(self, request, pk=None):
        return redirect(f"{settings.FRONTEND_URL}/order/{pk}?status=fail")

    @action(
        detail=True,
        methods=["get", "post"],
        url_path="ssl_cancel",
        permission_classes=[],
    )
    def ssl_cancel(self, request, pk=None):
        return redirect(f"{settings.FRONTEND_URL}/order/{pk}?status=cancel")
