from django.shortcuts import render
from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', views.course_list, name='courses'),
    path('search/', views.search, name='search'),
    path('create/', views.course_create, name='course_create'),
    path('manage/', views.course_list_manage, name='course_list'),
    path('update/<int:id>/', views.update_course, name='update_course'),
    path('delete/<int:id>/', views.delete_course, name='delete_course'),
    path('kategori/<slug:slug>/', views.getCoursesByCategory, name='courses_by_category'),
    path('<slug:slug>/', views.details, name='course_details'),
    
    
    path('upload/files/', views.upload_files, name='upload_files'),
    path('upload/basic/', views.basic_upload_view, name='basic_upload'),
    path('upload/model/', views.model_form_upload, name='model_form_upload'),
    path('upload/multi/', views.multi_upload_view, name='multi_upload'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)