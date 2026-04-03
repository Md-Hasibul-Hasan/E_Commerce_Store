from django.contrib import admin
from .models import *

# 🔥 Inline for multiple images
class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1   # number of empty fields shown


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'user','name', 'brand', 'category', 'price', 'countInStock', 'rating', 'numReviews')
    list_display_links = ('id', 'name')
    search_fields = ('name', 'brand', 'category')
    list_per_page = 20
    list_editable = ('price', 'countInStock', 'rating', 'numReviews')
    
    # ✅ attach images here
    inlines = [ProductImageInline]




class ReviewImageInline(admin.TabularInline):
    model = ReviewImage
    extra = 1


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('product', 'user', 'rating', 'createdAt')
    inlines = [ReviewImageInline]

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'paymentMethod', 'status', 'taxPrice', 'shippingPrice', 'totalPrice', 'isPaid', 'isDelivered')
    list_display_links = ('id', 'user')
    list_filter = ('paymentMethod', 'status', 'isPaid', 'isDelivered')
    search_fields = ('user__username', 'user__email')
    list_per_page = 20
    list_editable = ('paymentMethod', 'status', 'taxPrice', 'shippingPrice', 'totalPrice', 'isPaid', 'isDelivered')

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'product', 'order', 'name', 'qty', 'price', 'image')
    list_display_links = ('id', 'product')
    search_fields = ('product__name', 'order__user__username', 'order__user__email')
    list_per_page = 20
    list_editable = ('name', 'qty', 'price', 'image')

@admin.register(ShippingAddress)
class ShippingAddressAdmin(admin.ModelAdmin):
    list_display = ('id', 'order', 'address', 'city', 'postalCode', 'country', 'shippingPrice')
    list_display_links = ('id', 'order')
    search_fields = ('order__user__username', 'order__user__email')
    list_per_page = 20
    list_editable = ('address', 'city', 'postalCode', 'country', 'shippingPrice')






