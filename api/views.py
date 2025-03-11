from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import PlingerSerializer
from .serializers import FormSerializer
from forms.models import Form
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from company.models import CompanyMember, Company





@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def createPlingerAPI(request):
    # Si el usuario está autenticado, se obtiene su CompanyMember;
    # de lo contrario, se usa una compañía por defecto (por ejemplo, la primera registrada)
    if request.user.is_authenticated:
        try:
            member = CompanyMember.objects.get(user=request.user)
            company = member.company
        except CompanyMember.DoesNotExist:
            return Response({"error": "No se encontró CompanyMember para este usuario."}, status=status.HTTP_400_BAD_REQUEST)
    else:
        try:
            company = Company.objects.first()  # O asigna aquí un valor fijo configurado en settings
            if not company:
                return Response({"error": "No se encontró ninguna Company."}, status=status.HTTP_400_BAD_REQUEST)
        except Company.DoesNotExist:
            return Response({"error": "No se encontró ninguna Company."}, status=status.HTTP_400_BAD_REQUEST)
    
    serializer = PlingerSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(company=company)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




@api_view(['GET'])
def getFormConfiguration(request, form_id):
    try:
        form = Form.objects.get(id=form_id)
    except Form.DoesNotExist:
        return Response({"error": "Form not found"}, status=404)
    
    serializer = FormSerializer(form)
    return Response(serializer.data)