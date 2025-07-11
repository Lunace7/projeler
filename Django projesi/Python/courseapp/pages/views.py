from django.shortcuts import render
from django.http import HttpResponse
from courses.models import Course
from .models import Slider


def index(request):
    sliders = Slider.objects.filter(is_active=True).order_by('order')
    context = {
        'sliders': sliders
    }
    return render(request, 'pages/index.html', context)

def about(request):
    return render(request, 'pages/about.html')

def contact(request):
    return render(request, 'pages/contact.html')

