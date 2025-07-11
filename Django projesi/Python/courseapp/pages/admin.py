from django.contrib import admin
from .models import Slider

@admin.register(Slider)
class SliderAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_active', 'order')
    list_editable = ('is_active', 'order')
    search_fields = ('title', 'description')
