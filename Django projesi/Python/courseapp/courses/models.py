import os
from django.db import models
from django.utils.text import slugify

class Category(models.Model):
    name = models.CharField(max_length=40)
    slug = models.SlugField(default="", null=False, unique=True, db_index=True, max_length=50)

    def __str__(self):
        return f"{self.name}"

class Course(models.Model):
    title = models.CharField(max_length=50)
    description = models.TextField()
    image = models.ImageField(upload_to='course_images/', null=True, blank=True)
    date = models.DateField(auto_now=True)
    isActive = models.BooleanField()
    slug = models.SlugField(default="", blank=True, null=False, unique=True, db_index=True)
    categories = models.ManyToManyField(Category)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
            original_slug = self.slug
            count = 1
            while Course.objects.filter(slug=self.slug).exclude(pk=self.pk).exists():
                self.slug = f"{original_slug}-{count}"
                count += 1

        if self.image:
            filename, ext = os.path.splitext(self.image.name)
            self.image.name = f"{slugify(self.title)}{ext}"

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title}"

class MyModel(models.Model):
    title = models.CharField(max_length=100)
    image = models.ImageField(upload_to='uploads/', null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.image:
            filename, ext = os.path.splitext(self.image.name)
            self.image.name = f"{slugify(self.title)}{ext}"
        super().save(*args, **kwargs)
        
class Upload(models.Model):
    title = models.CharField(max_length=100)
    file = models.FileField(upload_to='uploads/')

class MultiUpload(models.Model):
    file = models.FileField(upload_to='multi_uploads/')

class UploadFiles(models.Model):
    title = models.CharField(max_length=100)
    files = models.FileField(upload_to='multiple_files/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Slider(models.Model):
    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to='sliders/')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']