from django import forms
from .models import Course, MyModel, UploadFiles

class CourseForm(forms.ModelForm):
    class Meta:
        model = Course
        fields = ['title', 'description', 'image', 'isActive', 'categories']
        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-control'}),
            'description': forms.Textarea(attrs={'class': 'form-control'}),
            'image': forms.ClearableFileInput(attrs={'class': 'form-control'}),
            'date': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
            'isActive': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
            'categories': forms.SelectMultiple(attrs={'class': 'form-control'}),
        }
        
class BasicFileUploadForm(forms.Form):
    file = forms.FileField()

class MyModelForm(forms.ModelForm):
    class Meta:
        model = MyModel
        fields = ['title', 'image']

class MultipleFileInput(forms.ClearableFileInput):
    allow_multiple_selected = True

class MultipleFileField(forms.FileField):
    def __init__(self, *args, **kwargs):
        kwargs.setdefault("widget", MultipleFileInput())
        super().__init__(*args, **kwargs)

    def clean(self, data, initial=None):
        single_file_clean = super().clean
        if isinstance(data, (list, tuple)):
            result = [single_file_clean(d, initial) for d in data]
        else:
            result = single_file_clean(data, initial)
        return result

class MultipleFileUploadForm(forms.Form):
    title = forms.CharField(max_length=100)
    files = MultipleFileField()

class FileUploadModelForm(forms.ModelForm):
    class Meta:
        model = UploadFiles
        fields = ['title', 'files']