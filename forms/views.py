from django.shortcuts import render
import json
from django.shortcuts import render, redirect, get_object_or_404
from django.views import View
from .models import Form
from django.contrib.auth.mixins import LoginRequiredMixin




def forms(request):
    return render(request, 'forms.html')




class FormularioCreateView(LoginRequiredMixin, View):
    def get(self, request):
        return render(request, 'forms.html')

    def post(self, request):
        # Recoger datos del formulario
        name = request.POST.get('formName')
        
        contact_methods = request.POST.getlist('contact_methods')
        contact_preference = request.POST.getlist('contact_preference')
        frequency = request.POST.getlist('frequency')
        
        # Campos de contacto
        email_field = {
            'required': request.POST.get('emailFieldRequired') == 'on',
            'placeholder': request.POST.get('emailPlaceholder')
        }
        phone_field = {
            'required': request.POST.get('phoneFieldRequired') == 'on',
            'placeholder': request.POST.get('phonePlaceholder')
        }
        
        # Armar la configuración del formulario
        configuration = {
            'contact_methods': contact_methods,
            'contact_info': {
                'email': email_field,
                'phone': phone_field,
            },
            'contact_preference': contact_preference,
            'frequency': frequency,
        }
        
        # Guardar el objeto Formulario
        formulario = Form.objects.create(
            name=name,
            configuration=configuration,
            created_by=request.user
        )
        
        # Generar el embed code usando el ID del formulario
        embed_code = f"""<!-- PlingMe Form Widget -->
<link rel="stylesheet" href="http://127.0.0.1:8000/static/assets/css/form-widget.css">
<div id="plingme-form-widget" data-form-id="{formulario.id}"></div>
<script src="http://127.0.0.1:8000/static/assets/js/form-widget.js"></script>"""

        # Renderizamos el mismo template con el embed code
        return render(request, 'forms.html', {'embed_code': embed_code})
