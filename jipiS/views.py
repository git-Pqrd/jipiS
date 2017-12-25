from django.views.generic import TemplateView
# from .models import oeuvre


class Index(TemplateView):
    template = 'index.html'
