from django.urls import path
from . import views


urlpatterns = [
    path('company-profile/', views.company_profile, name='company_profile'),
]