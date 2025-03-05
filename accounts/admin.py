from django.contrib import admin
from django.db import transaction
from .models import UserProfile

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email', 'role', 'language', 'is_staff', 'is_superuser')
    list_filter = ('role', 'language', 'is_staff', 'is_superuser')
    search_fields = ('email', 'first_name', 'last_name')

    @admin.action(description='Delete selected users (safe)')
    def safe_delete_selected(self, request, queryset):
        with transaction.atomic():
            for user in queryset:
                self._safe_delete_user(user)

    def delete_model(self, request, obj):
        with transaction.atomic():
            self._safe_delete_user(obj)

    def _safe_delete_user(self, user):
        user.groups.clear()
        user.user_permissions.clear()

        # Elimina relaciones one-to-many o many-to-many relacionadas
        for related in user._meta.related_objects:
            accessor_name = related.get_accessor_name()
            if hasattr(user, accessor_name):
                related_set = getattr(user, accessor_name)
                if hasattr(related_set, 'all'):
                    if hasattr(related_set, 'clear'):
                        related_set.clear()
                    else:
                        related_set.all().delete()

        user.delete()
