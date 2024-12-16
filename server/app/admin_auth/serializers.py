from rest_framework import serializers
from django.core.exceptions import ValidationError
from unicodedata import category

from .models import CategoriesStore, InformationPageStore, CategoriesType
import json


class InformationPageStoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = InformationPageStore
        fields = '__all__'


class CategoryTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriesType
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

        category_type = CategoriesType.objects.filter(category=type_category).first()
        category_store = CategoriesStore.objects.filter(name=type_category).first()

        if not category_type and not category_store:
            raise serializers.ValidationError({"type": "Указанная категория не существует."})
            # Если категория найдена в CategoriesStore, преобразуем её в CategoriesType
        if category_store and not category_type:
            # Пример преобразования (зависит от вашей бизнес-логики)
            category_type = CategoriesType.objects.create(category=category_store.name)
        # Присваиваем найденный объект в зависимости от источника
        data["type"] = category_type
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

