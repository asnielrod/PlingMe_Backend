from django.urls import path
from . import views



urlpatterns = [
    path('pings/', views.pings, name='pings'),
]   