from django.urls import path, include
from . import views
from base.views import admin_stats

from rest_framework.routers import DefaultRouter
router = DefaultRouter()

router.register('products', views.ProductView, basename='product')
router.register('productimages', views.ProductImageView, basename='productimage')
router.register('reviews', views.ReviewView, basename='review')
router.register('reviewimages', views.ReviewImageView, basename='reviewimage')
router.register('orders', views.OrderView, basename='order')
router.register('users', views.UserView, basename='user')


urlpatterns = [
    path('api/cart/', views.cart_items),
    path('api/cart/sync/', views.sync_cart),
    path('api/cart/clear/', views.clear_cart),
    path('api/cart/<int:product_id>/', views.cart_item_detail),
    path('api/', include(router.urls)),
    path('api/admin/stats/', admin_stats),
]
