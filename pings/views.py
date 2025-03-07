from django.shortcuts import render



def pings(request):
    return render(request, 'pings.html')

