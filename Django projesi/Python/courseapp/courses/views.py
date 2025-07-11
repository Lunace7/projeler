from datetime import date, datetime
from django.shortcuts import get_object_or_404, redirect, render
from .models import Course, Category, MultiUpload, UploadFiles
from django.core.paginator import Paginator
from .forms import BasicFileUploadForm, CourseForm, MyModelForm, MultipleFileUploadForm, FileUploadModelForm
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.contrib import messages
import os
from django.contrib.auth.decorators import login_required, user_passes_test

def index(request):
    kurslar = Course.objects.filter(isActive=True).order_by("date")
    kategoriler = Category.objects.all()

    search = request.GET.get("search")
    if search:
        kurslar = kurslar.filter(title__icontains=search)

    paginator = Paginator(kurslar, 3)
    page = request.GET.get('page', 1)

    try:
        page_obj = paginator.page(page)
    except:
        page_obj = paginator.page(1)

    return render(request, 'courses/index.html', {
        'categories': kategoriler,
        'page_obj': page_obj,
        'courses': page_obj.object_list
    })

def search(request):
    return course_list(request)

def details(request, slug):
    course = get_object_or_404(Course, slug=slug)
    return render(request, 'courses/details.html', {
        'course': course
    })

def getCoursesByCategory(request, slug):
    courses = Course.objects.filter(isActive=True, categories__slug=slug)
    categories = Category.objects.all()

    paginator = Paginator(courses, 3)
    page = request.GET.get('page', 1)

    try:
        page_obj = paginator.page(page)
    except:
        page_obj = paginator.page(1)

    return render(request, 'courses/index.html', {
        'categories': categories,
        'page_obj': page_obj,
        'courses': page_obj.object_list,
        'selected_category': slug
    })

def course_list(request):
    courses = Course.objects.filter(isActive=True)
    categories = Category.objects.all()

    query = request.GET.get('search', '')
    if query:
        courses = courses.filter(title__icontains=query)

    paginator = Paginator(courses, 3)
    page = request.GET.get('page', 1)

    try:
        page_obj = paginator.page(page)
    except:
        page_obj = paginator.page(1)

    return render(request, 'courses/index.html', {
        'categories': categories,
        'page_obj': page_obj,
        'courses': page_obj.object_list
    })

@user_passes_test(lambda u: u.is_staff)
def course_list_manage(request):
    courses = Course.objects.all()
    return render(request, 'courses/course_list.html', {
        'courses': courses
    })

@user_passes_test(lambda u: u.is_staff)
def course_create(request):
    if request.method == 'POST':
        form = CourseForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            messages.success(request, 'Kurs başarıyla oluşturuldu.')
            return redirect('course_list')
    else:
        form = CourseForm()
    
    return render(request, 'courses/course_form.html', {
        'form': form,
        'title': 'Kurs Ekle'
    })

@user_passes_test(lambda u: u.is_staff)
def update_course(request, id):
    course = get_object_or_404(Course, id=id)
    if request.method == 'POST':
        form = CourseForm(request.POST, request.FILES, instance=course)
        if form.is_valid():
            form.save()
            messages.success(request, 'Kurs başarıyla güncellendi.')
            return redirect('course_list')
    else:
        form = CourseForm(instance=course)
    
    return render(request, 'courses/course_form.html', {
        'form': form,
        'title': 'Kurs Güncelle'
    })

@user_passes_test(lambda u: u.is_staff)
def delete_course(request, id):
    course = get_object_or_404(Course, id=id)
    if request.method == 'POST':
        course.delete()
        messages.success(request, 'Kurs başarıyla silindi.')
        return redirect('course_list')
    
    return render(request, 'courses/delete.html', {
        'course': course
    })

def upload_view(request):
    if request.method == 'POST':
        form = MyModelForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return render(request, 'upload_success')
    else:
        form = MyModelForm()
    return render(request, 'upload.html', {'form': form})

def multi_upload_view(request):
    if request.method == 'POST':
        form = MultipleFileUploadForm(request.POST, request.FILES)
        if form.is_valid():
            title = form.cleaned_data['title']
            files = request.FILES.getlist('files')
            for f in files:
                MultiUpload.objects.create(file=f)
            messages.success(request, 'Dosyalar başarıyla yüklendi.')
            return redirect('multi_upload')
    else:
        form = MultipleFileUploadForm()
    return render(request, 'courses/multi_upload.html', {'form': form})

def basic_upload_view(request):
    if request.method == 'POST':
        form = BasicFileUploadForm(request.POST, request.FILES)
        if form.is_valid():
            uploaded_file = form.cleaned_data['file']
            upload_dir = 'media/uploads'
            if not os.path.exists(upload_dir):
                os.makedirs(upload_dir)
            
            file_path = os.path.join(upload_dir, uploaded_file.name)
            with open(file_path, 'wb+') as dest:
                for chunk in uploaded_file.chunks():
                    dest.write(chunk)
            messages.success(request, 'Dosya başarıyla yüklendi.')
            return redirect('basic_upload')
    else:
        form = BasicFileUploadForm()
    return render(request, 'courses/basic_upload.html', {'form': form})

def upload_files(request):
    if request.method == 'POST':
        form = MultipleFileUploadForm(request.POST, request.FILES)
        if form.is_valid():
            title = form.cleaned_data['title']
            files = request.FILES.getlist('files')
            
            for file in files:
                UploadFiles.objects.create(title=title, files=file)
            messages.success(request, 'Dosyalar başarıyla yüklendi.')
            return redirect('upload_files')
    else:
        form = MultipleFileUploadForm()
    return render(request, 'courses/upload_files.html', {'form': form})

def model_form_upload(request):
    if request.method == 'POST':
        form = FileUploadModelForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            messages.success(request, 'Dosya başarıyla yüklendi.')
            return redirect('model_form_upload')
    else:
        form = FileUploadModelForm()
    return render(request, 'courses/model_form_upload.html', {'form': form})
