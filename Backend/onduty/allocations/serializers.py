from rest_framework import serializers
from . models import allocations

class allocationsSerializer(serializers.ModelSerializer):

	class Meta:
		model = allocations
		fields = '__all__'