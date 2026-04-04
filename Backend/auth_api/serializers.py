from djoser.serializers import UserSerializer as DjoserUserSerializer
from djoser.serializers import UserCreateSerializer as DjoserUserCreateSerializer
from auth_api.models import User
from rest_framework import serializers


class UserCreateSerializer(DjoserUserCreateSerializer):
    class Meta(DjoserUserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'name', 'password')


class UserSerializer(DjoserUserSerializer):
    image = serializers.SerializerMethodField()
    class Meta(DjoserUserSerializer.Meta):
        model = User
        fields = ('id', 'email', 'name', 'phone', 'address', 'image', 'is_staff', 'is_superuser')

        def get_image(self, obj):
            if obj.image:
                return obj.image.url
            return None