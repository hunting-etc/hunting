from django.contrib import admin
from .models import  CategoriesType, CategoriesStore, InformationPageStore

# Register your models here.

admin.site.register(CategoriesType)
admin.site.register(CategoriesStore)
admin.site.register(InformationPageStore)
