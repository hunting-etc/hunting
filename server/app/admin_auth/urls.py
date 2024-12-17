from django.urls import path
from . import views
from .views import AllCategoryView, InformationPageStoreView,ImageView, ServiceStoreView



urlpatterns = [
    path('categories', AllCategoryView.as_view()),
    path('categories/<uuid:pk>', AllCategoryView.as_view()),
    path('image', ImageView.as_view()),
    path('image/<str:file_name>', ImageView.as_view()),
    path('infopages', InformationPageStoreView.as_view()),
    path('infopages/<uuid:pk>', InformationPageStoreView.as_view()),
    path('services', ServiceStoreView.as_view()),
    path('services/<uuid:pk>', ServiceStoreView.as_view()),
]