from django.shortcuts import render



def company_profile(request):
    return render(request, 'company_profile.html')
