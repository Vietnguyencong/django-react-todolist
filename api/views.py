from django.shortcuts import render
from .models import *
from django.http import JsonResponse
# Create your views here.

def index( request ):
    context = {}
    return render(request, 'api/index.html', context)
    
