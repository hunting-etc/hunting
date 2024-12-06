from rest_framework import serializers
from django.core.exceptions import ValidationError
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

        type_category = type_data.get("category")

        # Если категория не указана, пропускаем валидацию
        if not type_category:
            return data


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

