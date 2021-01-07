from django.shortcuts import render

def list(request):
    context = {}
    return render(request,'../frontendreact/public/index.html', context)