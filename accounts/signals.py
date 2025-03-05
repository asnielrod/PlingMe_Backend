from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import UserProfile
from company.models import Company, CompanyMember



@receiver(post_save, sender=UserProfile)
def create_company_for_owner(sender, instance, created, **kwargs):
    if not created:
        return

    # Si es superusuario, no hacemos nada
    if instance.is_superuser:
        return

    # Solo crea la company para roles OWNER normales
    if instance.role == UserProfile.OWNER:
        company = Company.objects.create(
            name=f"{instance.first_name}'s Company",
            owner=instance,
            email=instance.email
        )
        CompanyMember.objects.create(user=instance, company=company)

