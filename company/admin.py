from django.contrib import admin
from .models import Company, CompanyMember

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'owner', 'created_at')
    search_fields = ('name', 'email', 'owner__email')

@admin.register(CompanyMember)
class CompanyMemberAdmin(admin.ModelAdmin):
    list_display = ('user', 'company', 'joined_at', 'user_role')  
    search_fields = ('user__email', 'company__name')

    def user_role(self, obj):
        return obj.user.get_role_display()  
    user_role.short_description = 'Role'

    list_filter = ('company', 'joined_at')
