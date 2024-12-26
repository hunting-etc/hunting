from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import LoginSerializer, RegistrationSerializer
from django.contrib.auth.hashers import make_password
from django.http import JsonResponse
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model


class LoginView(APIView):

    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            login = serializer.validated_data['login']
            password = serializer.validated_data['password']

            # Аутентификация пользователя
            user = authenticate(request, username=login, password=password)
            print(user)
            if user is not None:
                # Генерация токенов
                refresh = RefreshToken.for_user(user)
                access_token = refresh.access_token

                return Response({
                    "success": True,
                    "message": "Вход выполнен",
                    "access": str(access_token),
                    "refresh": str(refresh),
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    "success": False,
                    "message": "Неверный логин или пароль",
                }, status=status.HTTP_401_UNAUTHORIZED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class RegistrationView(APIView):

    def post(self, request):
        # Проверяем, авторизован ли пользователь
        if request.user.is_authenticated:
            return Response(
                {"success": False, "message": "Вы уже авторизованы."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Обрабатываем данные для регистрации
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            # Создаем пользователя
            user = serializer.save(password=make_password(serializer.validated_data['password']))

            # Генерируем JWT токены
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token

            return Response(
                {
                    "success": True,
                    "message": "Пользователь успешно зарегистрирован.",
                    "access": str(access_token),
                    "refresh": str(refresh),
                },
                status=status.HTTP_201_CREATED,
            )

        # Возвращаем ошибки валидации
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class RefreshTokenView(APIView):
    def post(self, request):
        # Получение refresh token из тела запроса
        refresh_token = request.data.get('refresh')

        if not refresh_token:
            return Response({
                "success": False,
                "message": "Refresh token обязателен."
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Проверка и декодирование refresh token
            refresh = RefreshToken(refresh_token)

            # Генерация нового access token
            access_token = refresh.access_token

            return Response({
                "success": True,
                "access": str(access_token),
            }, status=status.HTTP_200_OK)

        except TokenError as e:
            return Response({
                "success": False,
                "message": "Неверный или истёкший refresh token."
            }, status=status.HTTP_401_UNAUTHORIZED)