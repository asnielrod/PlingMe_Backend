from django.urls import path
from . views import createPlingerAPI, getFormConfiguration
from rest_framework.authtoken.views import obtain_auth_token



urlpatterns = [
    path('plingers/', createPlingerAPI, name='api_create_plinger'),
    path('api-token-auth/', obtain_auth_token, name='api_token_auth'),
    path('forms/<uuid:form_id>/', getFormConfiguration, name='get_form_configuration'),
]