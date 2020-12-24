from django.shortcuts import render

def list(request):
    context = {}
    return render(request,'frontend/list.html', context)