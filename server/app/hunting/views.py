from django.shortcuts import render
from django.views.generic import DetailView, UpdateView, DeleteView
from django.http import HttpResponse
# Create your views here.
def entrance(request):
    return HttpResponse("Hello")

def user(request, name):
    return HttpResponse(f'<h2>Имя: {name}</h2>')
