from django.urls import path
from . import views

urlpatterns = [

    path('entrance/',views.entrance,name='entrance'),
    path('entrance/<str:name>/', views.user),
]