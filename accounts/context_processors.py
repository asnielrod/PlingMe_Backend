from accounts.models import UserProfile
from django.shortcuts import redirect

def lock_screen_processor(request):
    if request.user.is_authenticated and request.user.locked:
        if request.path != '/accounts/lock-screen/':
            return {'redirect_to_lock_screen': True}
    return {}



def current_user(request):
    """
    Context processor para agregar el usuario actual a todas las plantillas.
    """
    return {
        'current_user': request.user  
    }