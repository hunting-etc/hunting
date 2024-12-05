# Generated by Django 5.1.3 on 2024-12-05 11:27

import admin_auth.models
import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='CategoriesType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('category', models.CharField(max_length=255)),
            ],
            options={
                'verbose_name': 'Хранилище типов категорий',
                'verbose_name_plural': 'Хранилище типов категорий',
            },
        ),
        migrations.CreateModel(
            name='Service',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(help_text='Введите название услуги (до 200 символов).', max_length=200)),
                ('description', models.TextField(blank=True, help_text='Описание услуги.')),
            ],
        ),
        migrations.CreateModel(
            name='CategoriesStore',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('h1', models.CharField(blank=True, help_text='Введите заголовок (от 10 до 60 символов).', max_length=60)),
                ('title', models.CharField(blank=True, help_text='Введите заголовок страницы (от 30 до 80 символов).', max_length=80)),
                ('description', models.CharField(blank=True, help_text='Введите описание страницы (от 80 до 160 символов).', max_length=160)),
                ('name', models.CharField(help_text='Введите название (до 200 символов).', max_length=200)),
                ('photo', models.ImageField(help_text='Загрузите изображение не более 5 MB.', upload_to='static/images/', validators=[admin_auth.models.validate_image_size])),
                ('content', models.TextField(blank=True, help_text='Введите контент для блока.')),
                ('type', models.ForeignKey(blank=True, help_text='Выберите связанную категорию.', on_delete=django.db.models.deletion.CASCADE, to='admin_auth.categoriestype')),
            ],
            options={
                'verbose_name': 'Хранилище категорий',
                'verbose_name_plural': 'Хранилище категорий',
            },
        ),
        migrations.CreateModel(
            name='InformationPageStore',
            fields=[
                ('categoriesstore_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='admin_auth.categoriesstore')),
                ('services', models.ManyToManyField(blank=True, help_text='Выберите связанные услуги.', related_name='information_pages', to='admin_auth.service')),
            ],
            options={
                'verbose_name': 'Информационные страницы',
                'verbose_name_plural': 'Информационные страницы',
            },
            bases=('admin_auth.categoriesstore', models.Model),
        ),
    ]
