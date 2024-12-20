from rest_framework import serializers
from .models import Admins
from django.contrib.auth.hashers import make_password, check_password

# Сериализатор для входа
class LoginSerializer(serializers.Serializer):
    login = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)

# Сериализатор для регистрации
class RegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admins
        fields = ['login', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)
