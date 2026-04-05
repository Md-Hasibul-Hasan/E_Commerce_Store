from rest_framework import serializers
from .models import *
from auth_api.serializers import UserSerializer


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.image:
            representation['image'] = instance.image.url
        else:
            representation['image'] = None
        return representation



class ReviewImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewImage
        fields = ['id', 'image', 'review', ]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.image:
            representation['image'] = instance.image.url
        else:
            representation['image'] = None
        return representation





class ReviewSerializer(serializers.ModelSerializer):
    reviewimages = ReviewImageSerializer(many=True, read_only=True)

    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ['user'] 

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = '__all__' 




# 🔹 Order Item
class CartItemSerializer(serializers.ModelSerializer):
    cartItemId = serializers.IntegerField(source='id', read_only=True)
    id = serializers.IntegerField(source='product.id', read_only=True)
    name = serializers.CharField(source='product.name', read_only=True)
    price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)
    countInStock = serializers.IntegerField(source='product.countInStock', read_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = [
            'cartItemId',
            'id',
            'name',
            'price',
            'countInStock',
            'image',
            'quantity',
        ]

    def get_image(self, obj):
        request = self.context.get('request')
        first_image = obj.product.images.first()

        if not first_image:
            return None

        image_url = first_image.image.url
        # if request:
        #     return request.build_absolute_uri(image_url)
        return image_url


class CartItemWriteSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.image:
            representation['image'] = instance.image.url
        else:
            representation['image'] = None
        return representation


# 🔹 Shipping Address
class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = '__all__'


# 🔹 Order (MAIN)
# class OrderSerializer(serializers.ModelSerializer):
#     orderitems = OrderItemSerializer(many=True, read_only=True)
#     shippingAddress = ShippingAddressSerializer(read_only=True)
#     user = serializers.StringRelatedField(read_only=True)

#     class Meta:
#         model = Order
#         fields = '__all__'
#         read_only_fields = ['paidAt', 'deliveredAt', 'isPaid', 'isDelivered']

class OrderSerializer(serializers.ModelSerializer):
    orderitems = OrderItemSerializer(many=True, read_only=True)
    shippingAddress = serializers.SerializerMethodField(read_only=True)
    user = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "user",
            "paymentMethod",
            "taxPrice",
            "shippingPrice",
            "totalPrice",
            "isPaid",
            "paidAt",
            "isDelivered",
            "deliveredAt",
            "status",
            "expiresAt",
            "createdAt",
            "updatedAt",
            "orderitems",
            "shippingAddress",
        ]
        read_only_fields = ["id", "paidAt", "deliveredAt", "isPaid", "isDelivered", "createdAt", "updatedAt", "status", "expiresAt"]

    def get_shippingAddress(self, obj):
        shipping_address = getattr(obj, "shippingaddress", None)
        if not shipping_address:
            return None
        return ShippingAddressSerializer(shipping_address, many=False).data

    def get_user(self, obj):
        return obj.user.email if obj.user else None
