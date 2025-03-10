from django.urls import path
from . import views



urlpatterns = [
    path('plingers/', views.plingers, name='plingers'),
    path('plingers/add/', views.add_plinger, name='add_plinger'),
]