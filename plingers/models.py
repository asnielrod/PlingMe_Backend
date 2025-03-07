from django.db import models

class Plinger(models.Model):
    CONTACT_METHODS = [
        ('whatsapp', 'WhatsApp'),
        ('sms', 'SMS'),
        ('email', 'Email'),
        ('telegram', 'Telegram'),
        ('call', 'Llamada Telefónica'),
    ]

    CONTACT_CASES = [
        ('promos', 'Promociones'),
        ('new_products', 'Nuevos Productos'),
        ('news', 'Noticias Generales'),
        ('support', 'Soporte Técnico'),
    ]

    CONTACT_FREQUENCY = [
        ('once', 'Solo una vez'),
        ('weekly', 'Semanal'),
        ('monthly', 'Mensual'),
        ('custom', 'Personalizado'),
    ]

    name = models.CharField(max_length=100)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    whatsapp_phone = models.CharField(max_length=20, blank=True, null=True)
    telegram_phone = models.CharField(max_length=20, blank=True, null=True)

    plingme_by = models.JSONField(default=list)  # Ej: ["whatsapp", "email"]
    plingme_when = models.JSONField(default=list)  # Ej: ["promos", "new_products"]
    plingme_freq = models.CharField(max_length=20, choices=CONTACT_FREQUENCY, default='once')

    notes = models.TextField(blank=True, null=True)  # Por si quieres guardar alguna nota interna.
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=(
                    models.Q(email__isnull=False) |
                    models.Q(phone__isnull=False)
                ),
                name='require_email_or_phone'
            )
        ]

    def __str__(self):
        return f"{self.name} ({self.email or self.phone})"
