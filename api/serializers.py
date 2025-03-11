from rest_framework import serializers
from plingers.models import Plinger
from forms.models import Form






class PlingerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plinger
        exclude = ['company']

        
        
class FormSerializer(serializers.ModelSerializer):
    class Meta:
        model = Form
        fields = '__all__'
