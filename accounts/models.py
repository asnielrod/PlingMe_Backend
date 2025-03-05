from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager, Group, Permission

class UserProfileManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', UserProfile.OWNER)
        return self.create_user(email, password, **extra_fields)


class UserProfile(AbstractUser):
    OWNER = 1
    ADMIN = 2
    STAFF = 3

    ROLE_CHOICES = (
        (OWNER, 'Owner'),
        (ADMIN, 'Admin'),
        (STAFF, 'Staff'),
    )

    LANGUAGE_CHOICES = (
        ('es', 'Spanish'),
        ('en', 'English'),
    )

    username = None
    email = models.EmailField(unique=True)

    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)

    role = models.PositiveSmallIntegerField(choices=ROLE_CHOICES, default=STAFF)
    language = models.CharField(max_length=2, choices=LANGUAGE_CHOICES, default='en')
    locked = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    groups = models.ManyToManyField(Group, related_name="user_profiles", blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name="user_profiles", blank=True)

    objects = UserProfileManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return self.email
