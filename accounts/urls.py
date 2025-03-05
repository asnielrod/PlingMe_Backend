from django.urls import path
from . import views





urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('unlock/', views.unlock, name='unlock'),
    path('verify-code/', views.verify_code, name='verify_code'),
]