from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import LoginSerializer, RegistrationSerializer
from .models import Admins
from django.contrib.auth.hashers import check_password
from .services import CookieService
from django.http import JsonResponse


class LoginView(APIView):
    cookie_service = CookieService()

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            login = serializer.validated_data['login']
            password = serializer.validated_data['password']
            try:
                admin = Admins.objects.get(login=login)

            except Admins.DoesNotExist:

                return Response({"success": False, "message": "Неверный логин или пароль"},
                                status=status.HTTP_400_BAD_REQUEST)

            if check_password(password, admin.password):

                response = Response({"success": True, "message": "Вход выполнен"})
                self.cookie_service.set_cookie(response, 'user_login', login, max_age=1000)
                return response

            else:
                print(admin.password,":",password)
            return Response({"success": False, "message": "Неверный логин или пароль"},
                            status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CheckAuthView(APIView):#для авторизации из файлов куки
    def get(self, request):
        # Проверяем наличие cookie
        user_login = request.COOKIES.get('user_login')
        if user_login:
            return JsonResponse({"authenticated": True, "login": user_login})
        return JsonResponse({"authenticated": False})


class RegistrationView(APIView):
    cookie_service = CookieService()

    def post(self, request):
        # Проверяем, авторизован ли пользователь
        user_login = self.cookie_service.get_cookie(request, 'user_login')
        if not user_login:
            return Response(
                {"success": False, "message": "Вы должны быть авторизованы для выполнения этого действия."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Обрабатываем данные для регистрации
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"success": True}, status=status.HTTP_201_CREATED)

        # Возвращаем ошибки валидации
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)