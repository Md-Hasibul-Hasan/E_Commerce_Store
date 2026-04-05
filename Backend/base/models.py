# models.py

from django.db import models, transaction
# from django.contrib.auth.models import User
from auth_api.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.timezone import now
from cloudinary.models import CloudinaryField


class Product(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    name = models.CharField(max_length=200)
    brand = models.CharField(max_length=200)
    category = models.CharField(max_length=200)

    description = models.TextField(blank=True, null=True  )

    price = models.DecimalField(max_digits=10, decimal_places=2)
    countInStock = models.IntegerField(default=0)

    rating = models.FloatField(default=0)
    numReviews = models.IntegerField(default=0)

    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class ProductImage(models.Model):
    product = models.ForeignKey(
        Product,
        related_name='images',
        on_delete=models.CASCADE
    )
    # image = models.ImageField(upload_to='products/')
    image = CloudinaryField('product_images',null=True,blank=True)

    def __str__(self):
        return f"{self.product.name} Image"




   


STATUS_CHOICES = [
        ("pending", "Pending"),
        ("paid", "Paid"),
        ("delivered", "Delivered"),
        ("cancelled", "Cancelled"),
        ("returned", "Returned"),
    ]

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    paymentMethod = models.CharField(max_length=200, null=True)
    taxPrice = models.DecimalField(max_digits=17, decimal_places=2, null=True)
    shippingPrice = models.DecimalField(max_digits=17, decimal_places=2, null=True)
    totalPrice = models.DecimalField(max_digits=17, decimal_places=2, null=True)
    isPaid = models.BooleanField(default=False)
    paidAt = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    isDelivered = models.BooleanField(default=False)
    deliveredAt = models.DateTimeField(auto_now_add=False, null=True, blank=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")

    expiresAt = models.DateTimeField(null=True, blank=True)

    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)


    def __str__(self):
        return str(self.createdAt)

    def restore_stock(self):
        for item in self.orderitems.select_related("product"):
            product = item.product
            if product:
                product.countInStock += item.qty
                product.save(update_fields=["countInStock"])

    def cancel_if_expired(self):
        if self.status != "pending" or self.isPaid or not self.expiresAt:
            return False

        if self.expiresAt >= now():
            return False

        with transaction.atomic():
            locked_order = (
                Order.objects.select_for_update()
                .prefetch_related("orderitems__product")
                .get(pk=self.pk)
            )

            if (
                locked_order.status != "pending"
                or locked_order.isPaid
                or not locked_order.expiresAt
                or locked_order.expiresAt >= now()
            ):
                return False

            locked_order.status = "cancelled"
            locked_order.restore_stock()

            locked_order.save(update_fields=["status", "updatedAt"])
            from .emails import send_order_cancelled_email
            transaction.on_commit(lambda: send_order_cancelled_email(locked_order))

        self.status = "cancelled"
        return True
    

class OrderItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, related_name='orderitems', null=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='orderitems')
    name = models.CharField(max_length=200, null=True)
    qty = models.IntegerField(null=True)
    price = models.DecimalField(max_digits=7, decimal_places=2, null=True)
    # image = models.CharField(max_length=200, null=True, blank=True)
    image = CloudinaryField('orderitem_images',null=True,blank=True)

    def __str__(self):
        return str(self.product)
    

class CartItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cart_items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='cart_items')
    quantity = models.PositiveIntegerField(default=1)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'product')
        # ordering = ['-updatedAt']

    def __str__(self):
        return f"{self.user.email} - {self.product.name}"
    

class ShippingAddress(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, null=True)
    address = models.CharField(max_length=200, null=True)
    city = models.CharField(max_length=200, null=True)
    postalCode = models.CharField(max_length=200, null=True)
    country = models.CharField(max_length=200, null=True)
    shippingPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True)

    def __str__(self):
        return str(self.address)
    




class Review(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, null=True)
    product = models.ForeignKey(
        Product,
        related_name='reviews',
        on_delete=models.CASCADE
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE  
    )

    rating = models.FloatField(
    validators=[MinValueValidator(1), 
                MaxValueValidator(5)
            ])  

    name = models.CharField(max_length=200, null=True)
    comment = models.TextField(blank=True, null=True)

    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    # class Meta:
    #     unique_together = ('product', 'user')

    def __str__(self):
        return f"{self.product.name} - {self.user.name}"
    
class ReviewImage(models.Model):
    review = models.ForeignKey(
        Review,
        related_name='reviewimages',
        on_delete=models.CASCADE
    )
    # image = models.ImageField(upload_to='reviews/')
    image = CloudinaryField('review_images',null=True,blank=True)

    def __str__(self):
        return f"{self.review.product.name} Review Image"
 