from django.db import Error
from django.http import JsonResponse
from rest_framework_simplejwt.settings import api_settings
import jwt

class AuthorizationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):

        if request.method == 'POST' and request.path == '/test/login' or request.method == 'POST' and request.path == '/test/registration':
            return self.get_response(request)
        # Проверяем, относится ли путь к /test
        if request.path.startswith('/test'):
            token = request.headers.get('Authorization')

            if not token:
                return JsonResponse(
                    {"success": False, "message": "Токен не предоставлен."},
                    status=401
                )

            # Убираем префикс "Bearer ", если он есть
            if token.startswith("Bearer "):
                token = token[len("Bearer "):]

            try:
                # Преобразуем токен в bytes перед декодированием
                token_bytes = token.encode('utf-8')

                # Декодируем токен
                jwt.decode(
                    token_bytes,
                    api_settings.SIGNING_KEY,
                    algorithms=[api_settings.ALGORITHM]
                )
            except jwt.ExpiredSignatureError:
                return JsonResponse(
                    {"success": False, "message": "Срок действия токена истек."},
                    status=401
                )
            except jwt.InvalidTokenError as e:
                return JsonResponse(
                    {"success": False, "message": f"Неверный токен: {str(e)}"},
                    status=401
                )

        # Если путь не начинается с /test, пропускаем запрос без проверки
        return self.get_response(request)