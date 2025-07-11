from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.user_login, name='user_login'),
    path('register/', views.user_register, name='user_register'),
    path('logout/', views.user_logout, name='user_logout'),
    path('profile/', views.user_profile, name='user_profile'),
    path('my-courses/', views.user_courses, name='user_courses'),
    path('change-password/', views.change_password, name='change_password'),
] 