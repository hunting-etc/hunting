from ctypes.wintypes import PSIZE
from dbm import error
from django.shortcuts import render,redirect
from django.views.generic import DetailView, UpdateView, DeleteView
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import CategoriesStoreSerializer, InformationPageStoreSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status

from http import HTTPStatus
from rest_framework.permissions import DjangoModelPermissionsOrAnonReadOnly
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import InformationPageStore, CategoriesStore
from base.service import CategoryService,InformationPageService
from django.http import JsonResponse
import os


class AllCategoryView(APIView):
    service = CategoryService()

    # def get(self, request):
    #     items = CategoriesStore.objects.all()
    #     serializer = CategoriesStoreSerializer(items, many=True)
    #     return Response(serializer.data)
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
        # self.service.validation(request.data)
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
        # self.service.validation(request.data)
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

        # Удаляем объект
        instance.delete()
        return Response({"message": "Объект успешно удален"}, status=status.HTTP_204_NO_CONTENT)

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
    service = InformationPageService()

    def get(self, request):
        items = InformationPageStore.objects.all()
        serializer = InformationPageStoreSerializer(items, many=True)
        return Response(serializer.data)

    def post(self, request):
        self.service.validation(request.data)
        serializer = InformationPageStoreSerializer(data=request.data)
        if serializer.is_valid():
            instance=serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        """Метод для частичного обновления объекта."""
        try:
            # Находим объект по первичному ключу
            instance = InformationPageStore.objects.get(pk=pk)
        except InformationPageStore.DoesNotExist:
            return Response({"error": "Объект не найден"}, status=status.HTTP_404_NOT_FOUND)
        print(request.data)
        self.service.validation(request.data)
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

        # Удаляем объект
        instance.delete()
        return Response({"message": "Объект успешно удален"}, status=status.HTTP_204_NO_CONTENT)