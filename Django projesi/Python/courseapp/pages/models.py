from django.db import models

# Create your models here.

class Slider(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to="slider/")
    is_active = models.BooleanField(default=False)
    link = models.URLField(blank=True, null=True)
    order = models.IntegerField(default=0)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['order']
