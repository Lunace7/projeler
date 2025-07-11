from django import forms
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm, PasswordChangeForm
from django.contrib.auth.models import User

class LoginForm(AuthenticationForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['username'].widget = forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Kullanıcı adı'
        })
        self.fields['password'].widget = forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Parola'
        })

class RegisterForm(UserCreationForm):
    first_name = forms.CharField(
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Ad'
        })
    )
    last_name = forms.CharField(
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Soyad'
        })
    )
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={
            'class': 'form-control',
            'placeholder': 'Email'
        })
    )

    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name', 'password1', 'password2')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['username'].widget = forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Kullanıcı adı'
        })
        self.fields['password1'].widget = forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Parola'
        })
        self.fields['password2'].widget = forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Parola tekrar'
        })

class UserPasswordChangeForm(PasswordChangeForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['old_password'].widget = forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Eski parola'
        })
        self.fields['new_password1'].widget = forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Yeni parola'
        })
        self.fields['new_password2'].widget = forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Yeni parola tekrar'
        }) 