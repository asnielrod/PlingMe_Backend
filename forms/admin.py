from django.contrib import admin
from .models import Form


class FormAdmin(admin.ModelAdmin):
    list_display = ('id','name', 'created_at', 'updated_at')
    search_fields = ('name',)
    
admin.site.register(Form, FormAdmin)
