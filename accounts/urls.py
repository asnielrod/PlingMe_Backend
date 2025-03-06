from django.urls import path
from . import views





urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('lock-screen/', views.lock_screen, name='lock_screen'),
    path('unlock-screen/', views.unlock_screen, name='unlock_screen'),
    path('verify-code/', views.verify_code, name='verify_code'),
    path('logout/', views.logout, name='logout'),
    path('user-profile/', views.user_profile, name='user_profile'),
]