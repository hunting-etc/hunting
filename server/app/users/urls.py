from django.urls import path, include
from . import views
# Create your views here.
urlpatterns = [
    path('login', views.LoginView.as_view()),
    path('registration', views.RegistrationView.as_view()),
    # path('logout', views.Logout.as_view()),
    path('check-auth',views.CheckAuthView.as_view())
]