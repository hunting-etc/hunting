from .serializers import CategoriesStoreSerializer, InformationPageStoreSerializer,ServiceStoreSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import InformationPageStore, CategoriesStore, ServiceStore
from .service  import CategoryValidationSchema,InformationPageValidationSchema,ServiceValidationSchema
from django.http import JsonResponse
import os
from django.conf import settings
from django.db.models import ProtectedError


class AllCategoryView(APIView):

    def get(self, request, pk=None):
        """Обработка GET-запросов: либо получение всех объектов, либо одного по pk."""
        if pk:
            try:
                instance = CategoriesStore.objects.get(pk=pk)
            except CategoriesStore.DoesNotExist:
                return Response({"error": "Объект не найден"}, status=status.HTTP_404_NOT_FOUND)
            serializer = CategoriesStoreSerializer(instance)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            # Фильтрация по параметру `category`
            category_name = request.query_params.get('category')
            if category_name:
                # Фильтрация по вложенному полю `type__category`
                items = CategoriesStore.objects.filter(type__category__icontains=category_name)
            else:
                items = CategoriesStore.objects.all()

            serializer = CategoriesStoreSerializer(items, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):


        validation_result =CategoryValidationSchema.validate_or_error(request.data)
        if isinstance(validation_result, dict):  # Это словарь с ошибками
            return JsonResponse(validation_result, status=400)




        serializer = CategoriesStoreSerializer(data=request.data)
        if serializer.is_valid():
            instance=serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        """Метод для частичного обновления объекта."""
        try:
            # Находим объект по первичному ключу
            instance = CategoriesStore.objects.get(pk=pk)
        except CategoriesStore.DoesNotExist:
            return Response({"error": "Объект не найден"}, status=status.HTTP_404_NOT_FOUND)

        validation_result = CategoryValidationSchema.validate_or_error(request.data)
        if isinstance(validation_result, dict):  # Это словарь с ошибками
            return JsonResponse(validation_result, status=400)



        # Передаем объект и обновляемые данные в сериализатор
        serializer = CategoriesStoreSerializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            instance = serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """Метод для удаления объекта."""
        try:
            # Находим объект по первичному ключу
            instance = CategoriesStore.objects.get(pk=pk)
        except CategoriesStore.DoesNotExist:
            return Response({"error": "Объект не найден"}, status=status.HTTP_404_NOT_FOUND)

        content = instance.content  # Поле, где хранятся данные (JSON)
        image_dir = os.path.join(settings.BASE_DIR, 'static/images')  # Полный путь к папке с изображениями

        try:
            if content and isinstance(content, dict):  # Проверяем, что это словарь
                # Ищем пути изображений
                for block in content.get('blocks', []):
                    if block['type'] in ['image', 'gallery']:
                        files = (
                            block['data'].get('files', [])
                            if block['type'] == 'gallery'
                            else [block['data'].get('file')]
                        )
                        for file_data in files:
                            if file_data:
                                file_url = file_data.get('url')  # URL картинки
                                if file_url and 'static/images/' in file_url:  # Убеждаемся, что файл в нужной директории
                                    file_name = file_url.split('static/images/')[-1]  # Извлекаем имя файла
                                    file_path = os.path.join(image_dir, file_name)  # Полный путь к файлу
                                    if os.path.exists(file_path):
                                        os.remove(file_path)  # Удаляем файл
                                    else:
                                        raise FileNotFoundError(f"Файл {file_name} не найден по пути {file_path}")
            else:
                raise ValueError("Неверный формат содержимого в поле 'content'.")

            # Пытаемся удалить объект
            instance.delete()
            return Response({"message": "Объект успешно удален"}, status=status.HTTP_204_NO_CONTENT)

        except FileNotFoundError as e:
            # Ошибка при удалении файла
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except ValueError as e:
            # Ошибка с содержимым JSON
            return Response({"error": f"Ошибка при обработке содержимого: {str(e)}"},
                            status=status.HTTP_400_BAD_REQUEST)

        except ProtectedError as e:
            # Ошибка защиты от удаления (если объект используется где-то еще)
            return Response({"error": "Невозможно удалить объект, так как он используется в других местах."},
                            status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            # Ловим все остальные ошибки
            return Response({"error": f"Произошла ошибка: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class ImageView(APIView):
    def get(self, request, pk=None):
        """Обработка GET-запросов: либо получение всех объектов, либо одного по pk."""
        if pk:
            try:
                instance = CategoriesStore.objects.get(pk=pk)
            except CategoriesStore.DoesNotExist:
                return Response({"error": "Объект не найден"}, status=status.HTTP_404_NOT_FOUND)
            serializer = CategoriesStoreSerializer(instance)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            # Фильтрация по параметру `category`
            category_name = request.query_params.get('category')
            if category_name:
                # Фильтрация по вложенному полю `type__category`
                items = CategoriesStore.objects.filter(type__category__icontains=category_name)
            else:
                items = CategoriesStore.objects.all()

            serializer = CategoriesStoreSerializer(items, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)


    def post(self, request):
        if "image" in request.FILES:
            data = request.FILES["image"]
            # Валидация файла

            # Генерация уникального имени файла, если файл с таким именем уже существует
            file_name = str(data)
            image_dir = os.path.join('static/images')
            os.makedirs(image_dir, exist_ok=True)  # Создать папку, если её нет

            image_path = os.path.join(image_dir, file_name)
            base_name, extension = os.path.splitext(file_name)
            counter = 1
            while os.path.exists(image_path):
                file_name = f"{base_name}_{counter}{extension}"
                image_path = os.path.join(image_dir, file_name)
                counter += 1
            with open(image_path, 'wb') as image_file:
                for chunk in data.chunks():
                    image_file.write(chunk)
            return JsonResponse(
                {
                    "url": f"http://localhost:8000/static/images/{file_name}",
                    "name": file_name,
                    "size": data.size,
                    "type": data.content_type
                }, safe=False)

    def delete(self, request, file_name: str):
        image_path = os.path.join('static/images', file_name)
        if os.path.exists(image_path):
            os.remove(image_path)

        return JsonResponse(None, safe=False)


class InformationPageStoreView(APIView):


    def get(self, request, pk=None):
        """Обработка GET-запросов: либо получение всех объектов, либо одного по pk."""
        if pk:
            try:
                instance = InformationPageStore.objects.get(pk=pk)
            except InformationPageStore.DoesNotExist:
                return Response({"error": "Объект не найден"}, status=status.HTTP_404_NOT_FOUND)
            serializer = InformationPageStoreSerializer(instance)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            # Фильтрация по параметру `category`
            category_name = request.query_params.get('category')
            if category_name:
                # Фильтрация по вложенному полю `type__category`
                items = InformationPageStore.objects.filter(category__type__category__icontains=category_name)
            else:
                items = InformationPageStore.objects.all()

            serializer = InformationPageStoreSerializer(items, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):

        # print(request.data)
        validation_result = InformationPageValidationSchema.validate_or_error(request.data)
        if isinstance(validation_result, dict):  # Это словарь с ошибками
            return JsonResponse(validation_result, status=400)


        serializer = InformationPageStoreSerializer(data=request.data)
        if serializer.is_valid():
            instance = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        """Метод для частичного обновления объекта."""
        try:
            # Находим объект по первичному ключу
            instance = InformationPageStore.objects.get(pk=pk)
        except InformationPageStore.DoesNotExist:
            return Response({"error": "Объект не найден"}, status=status.HTTP_404_NOT_FOUND)

        validation_result = InformationPageValidationSchema.validate_or_error(request.data)
        if isinstance(validation_result, dict):  # Это словарь с ошибками
            return JsonResponse(validation_result, status=400)


        # Передаем объект и обновляемые данные в сериализатор
        serializer = InformationPageStoreSerializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            instance = serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """Метод для удаления объекта."""
        try:
            # Находим объект по первичному ключу
            instance = InformationPageStore.objects.get(pk=pk)
        except InformationPageStore.DoesNotExist:
            return Response({"error": "Объект не найден"}, status=status.HTTP_404_NOT_FOUND)

        content = instance.content  # Поле, где хранятся данные (JSON)
        image_dir = os.path.join(settings.BASE_DIR, 'static/images')  # Полный путь к папке с изображениями
        if content and isinstance(content, dict):  # Проверяем, что это словарь
            # Ищем пути изображений
            for block in content.get('blocks', []):
                if block['type'] in ['image', 'gallery']:
                    files = (
                        block['data'].get('files', [])
                        if block['type'] == 'gallery'
                        else [block['data'].get('file')]
                    )
                    for file_data in files:
                        if file_data:
                            file_url = file_data.get('url')  # URL картинки
                            if file_url and 'static/images/' in file_url:  # Убеждаемся, что файл в нужной директории
                                file_name = file_url.split('static/images/')[-1]  # Извлекаем имя файла
                                file_path = os.path.join(image_dir, file_name)  # Полный путь к файлу
                                if os.path.exists(file_path):
                                    os.remove(file_path)  # Удаляем файл

        # Удаляем объект
        instance.delete()
        return Response({"message": "Объект успешно удален"}, status=status.HTTP_204_NO_CONTENT)


class ServiceStoreView(APIView):


    def get(self, request, pk=None):
        """Обработка GET-запросов: либо получение всех объектов, либо одного по pk."""
        if pk:
            try:
                instance = ServiceStore.objects.get(pk=pk)
            except CategoriesStore.DoesNotExist:
                return Response({"error": "Объект не найден"}, status=status.HTTP_404_NOT_FOUND)
            serializer = ServiceStoreSerializer(instance)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            # Фильтрация по параметру `category`
            category_name = request.query_params.get('category')
            if category_name:
                # Фильтрация по вложенному полю `type__category`
                items = ServiceStore.objects.filter(category__type__category__icontains=category_name)
            else:
                items = ServiceStore.objects.all()

            serializer = ServiceStoreSerializer(items, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):

        # print(request.data)
        validation_result = ServiceValidationSchema.validate_or_error(request.data)
        if isinstance(validation_result, dict):  # Это словарь с ошибками
            return JsonResponse(validation_result, status=400)


        serializer = ServiceStoreSerializer(data=request.data)
        if serializer.is_valid():
            instance = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        """Метод для частичного обновления объекта."""
        try:
            # Находим объект по первичному ключу
            instance = ServiceStore.objects.get(pk=pk)
        except ServiceStore.DoesNotExist:
            return Response({"error": "Объект не найден"}, status=status.HTTP_404_NOT_FOUND)

        validation_result = ServiceValidationSchema.validate_or_error(request.data)
        if isinstance(validation_result, dict):  # Это словарь с ошибками
            return JsonResponse(validation_result, status=400)


        # Передаем объект и обновляемые данные в сериализатор
        serializer = ServiceStoreSerializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            instance = serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """Метод для удаления объекта."""
        try:
            # Находим объект по первичному ключу
            instance = ServiceStore.objects.get(pk=pk)
        except ServiceStore.DoesNotExist:
            return Response({"error": "Объект не найден"}, status=status.HTTP_404_NOT_FOUND)

        content = instance.content  # Поле, где хранятся данные (JSON)
        image_dir = os.path.join(settings.BASE_DIR, 'static/images')  # Полный путь к папке с изображениями
        if content and isinstance(content, dict):  # Проверяем, что это словарь
            # Ищем пути изображений
            for block in content.get('blocks', []):
                if block['type'] in ['image', 'gallery']:
                    files = (
                        block['data'].get('files', [])
                        if block['type'] == 'gallery'
                        else [block['data'].get('file')]
                    )
                    for file_data in files:
                        if file_data:
                            file_url = file_data.get('url')  # URL картинки
                            if file_url and 'static/images/' in file_url:  # Убеждаемся, что файл в нужной директории
                                file_name = file_url.split('static/images/')[-1]  # Извлекаем имя файла
                                file_path = os.path.join(image_dir, file_name)  # Полный путь к файлу
                                if os.path.exists(file_path):
                                    os.remove(file_path)  # Удаляем файл

        # Удаляем объект
        instance.delete()
        return Response({"message": "Объект успешно удален"}, status=status.HTTP_204_NO_CONTENT)