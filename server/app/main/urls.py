from django.urls import path
from . import views

urlpatterns = [

    path('',views.hunting_home,name='Home'),

]