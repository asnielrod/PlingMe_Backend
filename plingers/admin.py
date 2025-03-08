from django.contrib import admin
from .models import Plinger




class PlingerAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'company', 'created_at')
    search_fields = ('name', 'email', 'phone')
    list_filter = ('created_at',)
    
    
admin.site.register(Plinger, PlingerAdmin)
