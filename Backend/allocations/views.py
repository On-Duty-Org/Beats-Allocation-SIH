from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from . serializers import allocationsSerializer
from .models import allocations
from django.contrib.auth.decorators import login_required
from django.views.generic import CreateView
from .forms import AllocationForm, PoliceForm, ZoneForm
from police.models import polices
from zones.models import zones
from twilio.rest import Client                        

# Create your views here.


def dashboard(request):
	client = Client("<<>>", "<<>>")
   	if request.method == 'POST':
		a_form = AllocationForm(request.POST)
		p_form = PoliceForm(request.POST)
		z_form = ZoneForm(request.POST)
		if a_form.is_valid():
			a_form.save()
				zone = a_form.cleaned_data.get('zone')
				date = a_form.cleaned_data.get('date')
				start_time = a_form.cleaned_data.get('start_time')
				end_time = a_form.cleaned_data.get('end_time')
				print(str(zone))
				print(str(date))
				print(str(start_time))
				print(str(end_time))
				body = "Schedule Update: \nArea: " + str(zone) + "\nDate: " + str(date) + "\nStart Time: " + str(start_time) + "\nEnd Time: " + str(end_time)
				print(body)
				client.messages.create(to="+917985091041", from_="+12055094439", body=body)
		if p_form.is_valid():
			p_form.save()
		if z_form.is_valid():
			z_form.save()

	    a_form = AllocationForm()
	    p_form = PoliceForm()
	    z_form = ZoneForm()

	    context = {
		'a_form': a_form,
		'p_form': p_form,
		'z_form': z_form,
	    }
	    return render(request, 'allocations/allocations.html', context)


class pcount(APIView):
	
	def get(self, request):
		obj = allocations.objects.all()
		li = []
		for i in obj:
			li.append(i.police.name)
		li = set(li)
		total_police = polices.objects.all().count()
		unalloted_police = total_police-len(li)
		alloted_police = len(li)
		dict = {
		'total_police': total_police,
		'unalloted_police': unalloted_police,
		'alloted_police': alloted_police,
		}
		return Response(dict)


class zcount(APIView):
	
	def get(self, request):
		obj = allocations.objects.all()
		li = []
		for i in obj:
			li.append(i.zone.name)
		li = set(li)
		total_zones = zones.objects.all().count()
		unalloted_zones = total_zones-len(li)
		alloted_zones = len(li)
		dict = {
		'total_zones': total_zones,
		'unalloted_zones': unalloted_zones,
		'alloted_zones': alloted_zones,
		}
		return Response(dict)


class allocation(APIView):  # inherits from an APIView
	
	def get(self, request):
		obj = allocations.objects.all()   # creating objects of all the values
		serializer = allocationsSerializer(obj, many=True)  # pass these objects to the serializer which will convert them to json
		return Response(serializer.data, status=200)

	def post(self, request):
		data = request.data
		serializer = allocationsSerializer(data=data)  # this means that our data is being assigned to the data object, and hence a post request
		if serializer.is_valid():
			serializer.save()  # to do post request
			return Response(serializer.data, status=201)
		return Response(serializer.errors, status=400)


class allocationbyid(APIView):  # inherits from an APIView
	
	def get_object(self, id):
		try:
			return allocations.objects.get(id=id)
		except allocations.DoesNotExist as e:
			return Response({"error": "Given allocation record not found."}, status=404)

	def get(self, request, id=None):  # automatically detected what we specify as slash
		instance = self.get_object(id)   # Getting the object of the specified id
		serializer = allocationsSerializer(instance)  # pass these objects to the serializer which will convert them to json
		return Response(serializer.data)

	def put(self, request, id=None):
		data = request.data  # Our requested data which will be overwritten to the id we specify
		instance = self.get_object(id)   # Getting the object of the specified id
		serializer = allocationsSerializer(instance, data=data)  # instance is passed which contains our present data at that particular ID. This will be overwriten by our new data.
		if serializer.is_valid():
			serializer.save()  # to do post request
			return Response(serializer.data, status=200)
		return Response(serializer.errors, status=400)

	def delete(self, request, id=None):
		instance = self.get_object(id)
		serializer = allocationsSerializer(instance)  # pass these objects to the serializer which will convert them to json
		instance.delete()
		return Response(serializer.data)

