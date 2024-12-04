from rest_framework import serializers
from django.core.exceptions import ValidationError
from .models import CategoriesStore, InformationPageStore, CategoriesType


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
    # def create(self, validated_data):
    #     type_data = validated_data.pop('type', None)
    #
    #     # Если есть вложенные данные для `type`, создаем или получаем объект
    #     if type_data:
    #         type_instance, _ = CategoriesType.objects.get_or_create(**type_data)
    #         validated_data['type'] = type_instance
    #         return CategoriesStore.objects.create(**validated_data)
    #
    # def update(self, instance, validated_data):
    #     type_data = validated_data.pop('type', None)
    #
    #     # Если есть вложенные данные для `type`, обновляем или создаем объект
    #     if type_data:
    #         type_instance, _ = CategoriesType.objects.update_or_create(
    #             id=instance.type.id, defaults=type_data
    #         )
    #         instance.type = type_instance
    #
    #     # Обновляем остальные поля
    #     for attr, value in validated_data.items():
    #         setattr(instance, attr, value)
    #
    #     instance.save()
    #     return instance
    class Meta:
        model = CategoriesStore

        exclude = ['photo']
        # fields = '__all__'

