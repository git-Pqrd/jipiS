from django.db import models


class Evenement(models.Model):

    nom = models.CharField(max_length=100)
    description = models.CharField(max_length=300 , default='' )
    debut = models.DateField(auto_now=False, auto_now_add=False , blank=False ,null=False)
    fin = models.DateField( null=True , blank=True)

    def __str__(self) :
        return  self.nom + ' : ' + str(self.debut)

    def save(self , *args, **kwargs) :
        if not self.fin :
            self.fin = self.debut
        super(Evenement, self).save(*args, **kwargs)
    
