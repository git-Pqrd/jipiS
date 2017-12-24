# Create your views here.
from django.http import HttpResponse
from django.views.generic import TemplateView
from django.shortcuts import render
from jipiadmin.models import Evenement , Oeuvre




class ListIndex(TemplateView):

    template_name = "index.html"

    def get_context_data(self, **kwargs):
        context = super(ListIndex, self).get_context_data(**kwargs)
        context['events'] = Evenement.objects.all()[:5]
        context['oeuvre'] = Oeuvre.objects.all()
        return context
