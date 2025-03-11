import uuid
from django.db import models
from django.conf import settings

class Form(models.Model):
    # aqui use un UUID para tener un identificador para el embed
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200, help_text="Nombre del formulario")
    description = models.TextField(blank=True, null=True, help_text="Descripción o notas adicionales")
    # Aquí se almacena la configuración dinámica del formulario (campos, validaciones, etc.)
    configuration = models.JSONField(default=dict, help_text="Configuración del formulario en formato JSON")
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='formularios',
        help_text="Usuario que creó el formulario"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
