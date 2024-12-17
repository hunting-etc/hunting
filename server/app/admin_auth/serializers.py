from tkinter.font import names

from rest_framework import serializers
from django.core.exceptions import ValidationError
from unicodedata import category

from .models import CategoriesStore, InformationPageStore, CategoriesType,ServiceStore
import json

class ServiceStoreSerializer(serializers.ModelSerializer):
    category = serializers.SerializerMethodField()


    def validate(self, data):
        """
        Проверяем доступ только к полю name для category и services.
        """
        # Проверяем поле category
        category_data = self.initial_data.get("category", {})

        if isinstance(category_data, dict):  # Если пришел словарь
            if "name" not in category_data:
                raise serializers.ValidationError({"category": "Можно обращаться только к полю 'name'."})
            if len(category_data.keys()) > 1:
                raise serializers.ValidationError({"category": "К этому полю нельзя обратиться."})
        elif isinstance(category_data, str):
            try:
                category_data = json.loads(category_data)
                if not isinstance(category_data, dict) or "name" not in category_data:
                    raise serializers.ValidationError({"category": "Можно обращаться только к полю 'name'."})
            except json.JSONDecodeError:
                raise serializers.ValidationError({"category": "Неверный формат данных для category."})
        else:
            raise serializers.ValidationError({"category": "Поле category должно быть объектом с полем 'name'."})

        category_name = category_data.get("name")

        if not CategoriesStore.objects.filter(name=category_name).exists():
            raise serializers.ValidationError({"category": "Указанная категория не существует."})

            # Assign category data to `data["category"]`

        data["category"] = CategoriesStore.objects.get(name=category_name)

        return data

    def get_category(self, obj):
        """
        Возвращает данные о типе категории.
        """
        if obj.category:
            return CategoriesStoreSerializer(obj.category).data
        return None

    class Meta:
        model = ServiceStore
        fields = '__all__'



class CategoriesStoreSerializer(serializers.ModelSerializer):
    type =  serializers.SerializerMethodField()

    def validate(self, data):
        """
        Проверяем, что категория существует.
        """
        type_data = self.initial_data.get("type", {})

        # Если type_data — это строка, пробуем распарсить её как JSON
        if isinstance(type_data, str):
            try:
                type_data = json.loads(type_data)
            except json.JSONDecodeError:
                raise serializers.ValidationError({"type": "Неверный формат данных для type."})
        # Если `type` — пустой словарь
        if isinstance(type_data, dict) and not type_data:
            raise serializers.ValidationError({"type":"Поле не может быть пустым."})

        if "id" in type_data:
            raise serializers.ValidationError({"type": "К полю 'id' нельзя обратиться."})

        type_category = type_data.get("category")

        # Если категория не указана, пропускаем валидацию
        # if not type_category:
        #     return data

        if not type_category or not CategoriesType.objects.filter(category=type_category).exists():
            raise serializers.ValidationError({"type": "Указанная категория не существует."})

        # Присваиваем объект категории в validated_data
        data["type"] = CategoriesType.objects.get(category=type_category)
        return data

    def get_type(self, obj):
        """
        Возвращает данные о типе категории.
        """

        if obj.type:  # Предполагается, что поле `type` связано с объектом `CategoriesType`
            return {
                "id": obj.type.id,
                "category": obj.type.category,
            }
        return None
    class Meta:
        model = CategoriesStore

        # exclude = ['photo']
        fields = '__all__'



class InformationPageStoreSerializer(serializers.ModelSerializer):
    category =  serializers.SerializerMethodField() # Вложенный сериализатор для Category
    services = serializers.SerializerMethodField()

    def validate(self, data):
        """
        Проверяем доступ только к полю name для category и services.
        """
        # Проверяем поле category
        category_data = self.initial_data.get("category", {})

        if isinstance(category_data, dict):  # Если пришел словарь
            if "name" not in category_data:
                raise serializers.ValidationError({"category": "Можно обращаться только к полю 'name'."})
            if len(category_data.keys()) > 1:
                raise serializers.ValidationError({"category": "К этому полю нельзя обратиться."})
        elif isinstance(category_data, str):
            try:
                category_data = json.loads(category_data)
                if not isinstance(category_data, dict) or "name" not in category_data:
                    raise serializers.ValidationError({"category": "Можно обращаться только к полю 'name'."})
            except json.JSONDecodeError:
                raise serializers.ValidationError({"category": "Неверный формат данных для category."})
        else:
            raise serializers.ValidationError({"category": "Поле category должно быть объектом с полем 'name'."})



            # Проверяем поле services
        services_data = self.initial_data.get("services", [])
        if isinstance(services_data, str):
            try:
                services_data = json.loads(services_data)
            except json.JSONDecodeError:
                raise serializers.ValidationError({"services": "Неверный формат данных для services."})
        if isinstance(services_data, list):
            for service in services_data:
                if not isinstance(service, dict) or "name" not in service:
                    raise serializers.ValidationError({"services": "Можно обращаться только к полю 'name'."})
                if len(service.keys()) > 1:
                    raise serializers.ValidationError({"services": "К этому полю нельзя обратиться."})
        else:

            raise serializers.ValidationError(
                {"services": "Поле services должно быть списком объектов с полем 'name'."})

        valid_services = []

        for service_data in services_data:
            # Проверяем, что каждый элемент является словарем с ключом "name"
            if not isinstance(service_data, dict) or "name" not in service_data:
                raise serializers.ValidationError({"services": "Каждый объект должен содержать только поле 'name'."})

            service_name = service_data.get("name")

            # Проверяем, существует ли сервис с таким именем
            if not ServiceStore.objects.filter(name=service_name).exists():
                raise serializers.ValidationError({"services": f"Сервис с именем '{service_name}' не существует."})

            # Добавляем найденный сервис в список
            valid_services.append(ServiceStore.objects.get(name=service_name))

        # Присваиваем валидные сервисы в `data["services"]`
        data["services"] = valid_services

        # Присваиваем валидные категории в `data["category"]`
        category_name=category_data.get("name")

        if not CategoriesStore.objects.filter(name=category_name).exists():
            raise serializers.ValidationError({"category": "Указанная категория не существует."})

            # Assign category data to `data["category"]`

        data["category"] = CategoriesStore.objects.get(name=category_name)


        return data

    def get_category(self, obj):
        """
        Возвращает данные о типе категории.
        """
        if obj.category:
            return CategoriesStoreSerializer(obj.category).data
        return None

    def get_services(self, obj):
        """
        Возвращает список всех связанных услуг.
        """
        if obj.services.exists():  # Проверяем, есть ли связанные услуги
            return ServiceStoreSerializer(obj.services.all(), many=True).data
        return []

    class Meta:
        model = InformationPageStore
        fields = '__all__'
        # exclude = ['photo']




