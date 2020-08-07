from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

# Create your views here.

class LandingPage(APIView):

	def get(self, request):
		s = {'message' : 'Welcome to OnDuty APIs', 'documentation' : '<documentation link to be put here>'}
		return Response(s)  # Response is required because it's API view
