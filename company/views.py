from django.shortcuts import render
from .forms import CompanyForm
from django.contrib import messages



def company_profile(request):
    company = request.user.owned_company

    if request.method == 'POST':
        form = CompanyForm(request.POST, request.FILES, instance=company, user=request.user)
        if form.is_valid():
            form.save()
            messages.success(request, 'Company profile updated successfully.')
        else:
            messages.error(request, 'Please correct the errors below.')
    else:
        form = CompanyForm(instance=company, user=request.user)

    return render(request, 'company_profile.html', {
        'form': form,
        'company': company,
    })