from django.db import models
from admin_auth.models import BaseUUID
from django.contrib.auth.models import AbstractUser,BaseUserManager, Group, Permission

# Create your models here.

class AdminsManager(BaseUserManager):
    def create_user(self, login, password=None, **extra_fields):
        if not login:
            raise ValueError("Поле login обязательно.")
        user = self.model(login=login, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, login, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError("Суперпользователь должен иметь is_staff=True.")
        if extra_fields.get('is_superuser') is not True:
            raise ValueError("Суперпользователь должен иметь is_superuser=True.")

        return self.create_user(login, password, **extra_fields)

class Admins(AbstractUser):
    username = None
    login = models.CharField(max_length=150, unique=True)

    USERNAME_FIELD = 'login'
    REQUIRED_FIELDS = []

    groups = models.ManyToManyField(
        Group,
        related_name="admins_groups",  # Уникальное имя обратной ссылки
        blank=True
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="admins_user_permissions",  # Уникальное имя обратной ссылки
        blank=True
    )
    objects = AdminsManager()

    def __str__(self):
        return self.login