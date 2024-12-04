from django.shortcuts import render
from django.views.generic import DetailView, UpdateView, DeleteView
from django.http import HttpResponse

def hunting_home(request):
    return HttpResponse("Hello")