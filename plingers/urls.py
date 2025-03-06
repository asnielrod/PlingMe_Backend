from django.urls import path
from . import views



urlpatterns = [
    path('plingers/', views.plingers, name='plingers'),
]