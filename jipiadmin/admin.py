from django.contrib import admin
from .models import Evenement, Oeuvre 
# Register your models here.

@admin.register(Evenement)
class Evenement(admin.ModelAdmin):
    pass

@admin.register(Oeuvre)
class Oeuvre(admin.ModelAdmin):
    pass
