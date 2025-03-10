from django.shortcuts import render
from .models import Plinger
from company.models import CompanyMember
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt





def plingers(request):
    try:
        company_member = CompanyMember.objects.get(user=request.user)
        qs = Plinger.objects.filter(company=company_member.company)
        plingers_list = []
        
        for p in qs:
            # Extraer los arrays de los diccionarios
            plingme_by_list = p.plingme_by.get('Plingme_by', []) if isinstance(p.plingme_by, dict) else p.plingme_by
            plingme_when_list = p.plingme_when.get('Plingme_when', []) if isinstance(p.plingme_when, dict) else p.plingme_when
            
            plingers_list.append({
                'id': p.id,
                'name': p.name,
                'email': p.email,
                'phone': p.phone,
                'plingme_by': plingme_by_list,
                'plingme_when': plingme_when_list,
                'plingme_freq': p.plingme_freq,
                'plingme_freq_display': p.get_plingme_freq_display(),
                'created_at': p.created_at.strftime("%d/%m/%Y, %H:%M")
            })
        
        plingers_json = json.dumps(plingers_list)
    
    except CompanyMember.DoesNotExist:
        plingers_list = []
        plingers_json = '[]'
    
    return render(request, 'plingers.html', {
        'plingers': plingers_list,  # Para la tabla
        'plingers_json': plingers_json  # Para el script que muestra los detalles
    })
    
    

@csrf_exempt
def add_plinger(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            company_member = CompanyMember.objects.get(user=request.user)

            # Asegurar que los valores de plingme_by y plingme_when sean listas
            plingme_by = data.get("plingme_by", [])
            plingme_when = data.get("plingme_when", [])

            if not isinstance(plingme_by, list):
                plingme_by = [plingme_by]
            if not isinstance(plingme_when, list):
                plingme_when = [plingme_when]

            plinger = Plinger.objects.create(
                company=company_member.company,
                name=data.get("name"),
                email=data.get("email"),
                phone=data.get("phone"),
                plingme_by=plingme_by,
                plingme_when=plingme_when,
                plingme_freq=data.get("plingme_freq"),
                notes=data.get("notes", ""),
            )
            return JsonResponse({"success": True, "message": "Plinger added successfully!", "id": plinger.id})
        
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=400)

    return JsonResponse({"success": False, "message": "Invalid request"}, status=400)