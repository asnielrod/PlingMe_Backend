from django.shortcuts import render, redirect
from django.contrib.auth import login as auth_login
from .forms import CustomUserCreationForm, LoginForm
from .models import UserProfile
from django.contrib.auth import authenticate
from django.contrib.auth import logout as auth_logout
from django.contrib.auth.decorators import login_required




def register(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data.get('email')
            if UserProfile.objects.filter(email=email).exists():
                form.add_error('email', 'A user with this email already exists.')
                return render(request, 'register.html', {'form': form})

            user = form.save()

            # La señal se encarga de crear la compañía automáticamente
            auth_login(request, user)
            return redirect('index')  
    else:
        form = CustomUserCreationForm()

    return render(request, 'register.html', {'form': form})




def login(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']

            user = authenticate(request, email=email, password=password)

            if user is None:
                form.add_error(None, 'Invalid email or password.')
                return render(request, 'login.html', {'form': form})

            auth_login(request, user)
            return redirect('index')  
    else:
        form = LoginForm()

    return render(request, 'login.html', {'form': form})


@login_required
def logout(request):
    auth_logout(request)
    return redirect('login') 
    

@login_required
def lock_screen(request):
    request.user.locked = True
    request.user.save()
    return render(request, 'unlock_screen.html')



@login_required
def unlock_screen(request):
    request.user.refresh_from_db()  
    if not request.user.locked:
        return redirect('index')

    error = None
    if request.method == 'POST':
        password = request.POST.get('password')

        if request.user.check_password(password):
            request.user.locked = False
            request.user.save()
            return redirect('index')

        error = 'Invalid password.'

    return render(request, 'unlock_screen.html', {'error': error})





def verify_code(request):
    return render(request, 'verify_code.html')