from django.db import models
from admin_auth.models import BaseUUID

# Create your models here.
class Admins(BaseUUID):
    login = models.CharField(max_length=50)
    password = models.CharField(max_length=100)