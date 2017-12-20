from django.contrib import admin
from .models import Evenement
# Register your models here.

@admin.register(Evenement)
class Evenement(admin.ModelAdmin):
    nom = 'jo'
    pass
