from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .forms import LoginForm, RegisterForm, UserPasswordChangeForm

def user_login(request):
    if request.user.is_authenticated:
        return redirect('index')
        
    if request.method == 'POST':
        form = LoginForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)

            if user is not None:
                login(request, user)
                messages.success(request, 'Başarıyla giriş yaptınız.')
                return redirect('index')
            else:
                messages.error(request, 'Kullanıcı adı veya parola hatalı.')
    else:
        form = LoginForm()
    
    return render(request, 'account/login.html', {'form': form})

def user_register(request):
    if request.user.is_authenticated:
        return redirect('index')
        
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            messages.success(request, 'Hesabınız oluşturuldu.')
            login(request, user)
            return redirect('index')
    else:
        form = RegisterForm()
    
    return render(request, 'account/register.html', {'form': form})

def user_logout(request):
    logout(request)
    messages.success(request, 'Çıkış yapıldı.')
    return redirect('index')

@login_required
def user_profile(request):
    if request.method == 'POST':
        user = request.user
        user.first_name = request.POST.get('first_name', '')
        user.last_name = request.POST.get('last_name', '')
        user.email = request.POST.get('email', '')
        user.save()
        messages.success(request, 'Profil bilgileriniz güncellendi.')
        return redirect('user_profile')
        
    return render(request, 'account/profile.html')

@login_required
def user_courses(request):
    # Burada kullanıcının kayıtlı olduğu kursları göstereceğiz
    return render(request, 'account/my_courses.html')

@login_required
def change_password(request):
    if request.method == 'POST':
        form = UserPasswordChangeForm(request.user, request.POST)
        if form.is_valid():
            user = form.save()
            update_session_auth_hash(request, user)
            messages.success(request, 'Parolanız başarıyla güncellendi.')
            return redirect('change_password')
    else:
        form = UserPasswordChangeForm(request.user)
    
    return render(request, 'account/change_password.html', {'form': form})
