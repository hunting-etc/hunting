from django.core.exceptions import ValidationError
from pydantic import BaseModel, Field, ValidationError
from django.http import QueryDict


class CategoryValidationSchema(BaseModel):
    h1: str = Field(..., min_length=10, max_length=60, description="Поле должно содержать от 10 до 60 символов.")
    title:str=Field(..., min_length=30, max_length=80, description="Поле должно содержать от 30 до 80 символов.")
    description:str=Field(..., min_length=80, max_length=160, description="Поле должно содержать от 80 до 160 символов.")
    name:str=Field(..., max_length=200, description="Поле должно содержать до 200 символов.")

    @classmethod
    def validate_or_error(cls, data):
        try:
            simple_data = {}
            if isinstance(data, QueryDict):#Это если данные из Form-data(мега костыль)
                for key in data.keys():
                    simple_data[key] = data.getlist(key)[0]
                return cls(**simple_data)# Можно ли иначе подружить Form-data и Pydantic?
            else:
                return cls(**data)

        except ValidationError as e:

            # Возвращаем API-ответ с ошибками
            formatted_errors = cls.format_errors(e.errors())
            return formatted_errors

    @staticmethod
    def format_errors(errors):
        # Преобразуем список ошибок в формат {поле: [сообщения]}
        formatted = {}
        for error in errors:
            field = error["loc"][-1]  # Получаем имя поля
            message = error["msg"]  # Сообщение об ошибке
            formatted.setdefault(field, []).append(message)  # Собираем сообщения в список
        return formatted



class BaseValidationService:
    """Базовый сервис для общей валидации."""

    def validate_field_length(self, field_name, min_length, max_length, data):
        """Проверка длины строкового поля."""
        if field_name in data:
            if not (min_length <= len(data[field_name]) <= max_length):
                raise ValidationError(
                    {field_name: f"Поле '{field_name}' должно содержать от {min_length} до {max_length} символов."})
        else:
            raise ValidationError({field_name: f"Поле '{field_name}' обязательно."})


    def validate_name(self, field_name,max_length, data):
        print(data)
        if data.get(field_name) and len(data[field_name]) > max_length:
            raise ValidationError({field_name: f"Поле '{field_name}' должно содержать до '{max_length}' символов."})



    def validate_photos(self, field_name, data):
        """Проверка фотографий (если они указаны)."""
        if data.get(field_name) and len(data[field_name]) > 255:
            raise ValidationError({field_name: "Слишком длинное имя файла для фотографии."})


    def validate_content(self, field_name, data):
        """Проверка наличия контента."""
        if field_name not in data or not data[field_name].strip():
            raise ValidationError({field_name: "Поле 'content' обязательно."})



    # def validate_servise(self, ):
    #     ...


    def generate_default_fields(self, data):
        """Генерация значений по умолчанию для полей, если они не указаны."""
        data.setdefault("h1", self.generate_h1())
        data.setdefault("title", self.generate_title())
        data.setdefault("description", self.generate_description())


    def generate_h1(self):
        return "Default H1"

    def generate_title(self):
        return "Default Title"

    def generate_description(self):
        return "Default Description"


class CategoryService(BaseValidationService):
    def validation(self, data):
        # Проверка обязательных полей

        validators = {
            "h1": lambda: self.validate_field_length("h1", 10, 60, data),
            "title": lambda: self.validate_field_length("title", 30, 80, data),
            "description": lambda: self.validate_field_length("description", 80, 160, data),
            "photos": lambda: self.validate_photos("photos", data),
            "name": lambda: self.validate_name("name", 200, data),
            "content": lambda: self.validate_content("content", data),

        }

        # Выполняем валидацию только для присутствующих в data полей
        for field, validator in validators.items():
            if field in data:
                validator()

        # Генерация значений по умолчанию
        if all(key in data for key in validators.keys()):
            self.generate_default_fields(data)

class InformationPageService(BaseValidationService):
    def validation(self, data: object) -> object:

        validators = {
            "h1": lambda: self.validate_field_length("h1", 10, 60, data),
            "title": lambda: self.validate_field_length("title", 30, 80, data),
            "description": lambda: self.validate_field_length("description", 80, 160, data),
            "photos": lambda: self.validate_photos("photos", data),
            "name": lambda: self.validate_name("name", 200, data),
            "content": lambda: self.validate_content("content", data),
            # "servise": lambda :self.validate_servise()
        }

        # Выполняем валидацию только для присутствующих в data полей
        for field, validator in validators.items():
            if field in data:
                validator()

        # Генерация значений по умолчанию
        if all(key in data for key in validators.keys()):
            self.generate_default_fields(data)




# class CategoryService(BaseValidationService, BaseService):
#
#     def validation(self, data):
#         self.validate_field_length("name", 1, 100, data)