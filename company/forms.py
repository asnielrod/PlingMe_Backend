from django import forms
from .models import Company




class CompanyForm(forms.ModelForm):
    class Meta:
        model = Company
        fields = ['name', 'description', 'logo', 'email', 'phone', 'website', 'address', 'country']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control mb-0'}),
            'description': forms.Textarea(attrs={'class': 'form-control mb-0'}),
            'logo': forms.FileInput(attrs={'class': 'form-control mb-0'}),
            'email': forms.EmailInput(attrs={'class': 'form-control mb-0'}),
            'phone': forms.TextInput(attrs={'class': 'form-control mb-0'}),
            'website': forms.URLInput(attrs={'class': 'form-control mb-0'}),
            'address': forms.TextInput(attrs={'class': 'form-control mb-0'}),
            'country': forms.TextInput(attrs={'class': 'form-control mb-0'}),
        }

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user', None)
        super(CompanyForm, self).__init__(*args, **kwargs)

    def save(self, commit=True):
        company = super().save(commit=False)
        if not company.pk:
            company.owner = self.user
        if commit:
            company.save()
        return company
