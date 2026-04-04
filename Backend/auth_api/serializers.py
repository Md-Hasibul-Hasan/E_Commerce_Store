from djoser.serializers import UserSerializer as DjoserUserSerializer
from djoser.serializers import UserCreateSerializer as DjoserUserCreateSerializer
from auth_api.models import User
from rest_framework import serializers


class UserCreateSerializer(DjoserUserCreateSerializer):
    class Meta(DjoserUserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'name', 'password')


class UserSerializer(DjoserUserSerializer):
    phone = serializers.CharField(required=False, allow_blank=True)
    
    class Meta(DjoserUserSerializer.Meta):
        model = User
        fields = ('id', 'email', 'name', 'phone', 'address', 'image', 'is_staff', 'is_superuser')

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.image:
            representation['image'] = instance.image.url
        else:
            representation['image'] = None
        return representation