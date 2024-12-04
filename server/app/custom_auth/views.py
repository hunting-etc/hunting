from django.shortcuts import render
from django.template.context_processors import request
from django.views.generic import DetailView, UpdateView, DeleteView
from django.http import HttpResponse

# Create your views here.
class hunting_home(DetailView):
    template_name =HttpResponse("<h1>xyi<h1>")
