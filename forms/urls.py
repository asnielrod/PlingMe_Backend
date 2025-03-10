from django.urls import path
from . views import FormularioCreateView, forms


urlpatterns = [
    path('', forms, name='forms'),
    path('forms/create/', FormularioCreateView.as_view(), name='create_formulario'),
]