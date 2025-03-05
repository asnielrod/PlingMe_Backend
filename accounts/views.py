from django.shortcuts import render





def register(request):
    return render(request, 'register.html')



def login(request):
    return render(request, 'login.html')


def unlock(request):
    return render(request, 'unlock.html')


def verify_code(request):
    return render(request, 'verify_code.html')