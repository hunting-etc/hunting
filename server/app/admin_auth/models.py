from django.db import models
from django.core.exceptions import ValidationError
from PIL import Image
import uuid
import os


# Утилита для обработки изображений
def compress_image(image_path):
    with Image.open(image_path) as img:
        img = img.convert("RGB")
        img.thumbnail((1920, 1080))  # Уменьшаем размер, если изображение слишком большое
        img.save(image_path, optimize=True, quality=85)


# Проверка размера загружаемого изображения
def validate_image_size(image):
    max_file_size = 5 * 1024 * 1024  # 5 MB
    if image.size > max_file_size:
        raise ValidationError(
            f"Размер файла не должен превышать 5 MB. Текущий размер: {image.size / (1024 * 1024):.2f} MB"
        )


class BaseUUID(models.Model):
    """Абстрактный класс с UUID."""
    id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, primary_key=True)

    class Meta:
        abstract = True  # Делаем этот класс абстрактным


class BaseCategory(BaseUUID):
    """Абстрактный базовый класс для общих полей категорий."""

    # H1 - от 10 до 60 символов
    h1 = models.CharField(
        max_length=60,
        blank=True,
        help_text="Введите заголовок (от 10 до 60 символов)."
    )

    # Title - от 30 до 80 символов
    title = models.CharField(
        max_length=80,
        blank=True,
        help_text="Введите заголовок страницы (от 30 до 80 символов)."
    )

    # Description - от 80 до 160 символов
    description = models.CharField(
        max_length=160,
        blank=True,
        help_text="Введите описание страницы (от 80 до 160 символов)."
    )

    # Название - до 200 символов
    name = models.CharField(
        unique=True,
        max_length=200,
        help_text="Введите название (до 200 символов)."
    )

    # Фото - загрузка изображения
    photo = models.ImageField(
        upload_to='static/images/',
        validators=[validate_image_size],
        help_text="Загрузите изображение не более 5 MB."
    )

    # Контент - блок произвольного текста
    content = models.JSONField(
        blank=True,
        null=True,
        help_text="Введите контент для блока."
    )

    def save(self, *args, **kwargs):
        # Проверяем, обновляется ли объект
        if self.pk:
            old_instance = self.__class__.objects.filter(pk=self.pk).first()
            if old_instance and old_instance.photo != self.photo:
                old_photo_path = old_instance.photo.path
                # Удаляем старое фото, если путь существует
                if os.path.isfile(old_photo_path):
                    os.remove(old_photo_path)

        # Сохраняем новую фотографию
        super().save(*args, **kwargs)

        # Сжимаем изображение
        if self.photo:
            image_path = self.photo.path
            compress_image(image_path)

    def delete(self, *args, **kwargs):
        # Удаляем файл перед удалением объекта
        if self.photo and os.path.isfile(self.photo.path):
            os.remove(self.photo.path)
        super().delete(*args, **kwargs)

    def __str__(self):
        return self.name

    class Meta:
        abstract = True


class CategoriesType(models.Model):
    """Тип категории."""
    category = models.CharField(max_length=255)

    def __str__(self):
        return self.category

    class Meta:
        verbose_name = "Хранилище типов категорий"
        verbose_name_plural = "Хранилище типов категорий"


class CategoriesStore(BaseCategory):
    """Хранилище категорий."""
    type = models.ForeignKey(
        CategoriesType,
        on_delete=models.CASCADE,
        blank=True,
        help_text="Выберите связанную категорию."
    )

    class Meta:
        verbose_name = "Хранилище категорий"
        verbose_name_plural = "Хранилище категорий"


class ServiceStore(BaseCategory):
    """Модель для представления услуг."""
    price = models.CharField(
        max_length=50,
        blank=True,
        help_text="Введите цену страницы (до 50 символов)."
    )
    category = models.ForeignKey(
        CategoriesStore,
        on_delete=models.PROTECT,
        blank=True,
        help_text="Выберите связанную категорию."
    )

    class Meta:
        verbose_name = "Страницы услуг"
        verbose_name_plural = "Страницы услуг"


class InformationPageStore(BaseCategory):
    """Хранилище информационных страниц."""

    category = models.ForeignKey(
        CategoriesStore,
        on_delete=models.PROTECT,
        blank=True,
        help_text="Выберите связанную категорию."
    )

    services = models.ManyToManyField(
        ServiceStore,
        blank=True,
        related_name="information_pages",
        help_text="Выберите связанные услуги."
    )

    class Meta:
        verbose_name = "Информационные страницы"
        verbose_name_plural = "Информационные страницы"

    def __str__(self):
        return self.name




