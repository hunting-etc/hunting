from django.urls import path
from . import views
from .views import AllCategoryView, InformationPageStoreView,ImageView



urlpatterns = [
    path('categories', AllCategoryView.as_view()),
    path('categories/<uuid:pk>', AllCategoryView.as_view()),
    path('admin/image', ImageView.as_view()),
    path('admin/image/<str:file_name>', ImageView.as_view()),
    path('categories/infopage', InformationPageStoreView.as_view()),
    path('categories/infopage/<uuid:pk>', InformationPageStoreView.as_view()),
]