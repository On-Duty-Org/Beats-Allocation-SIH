from django.db import models
from django.utils import timezone
import datetime
from django.urls import reverse
from police.models import polices
from zones.models import zones

# Create your models here.

class allocations(models.Model):

    class Meta:
        verbose_name_plural = 'allocations'

    zone = models.ForeignKey(zones, on_delete=models.CASCADE)
    police = models.ForeignKey(polices, on_delete=models.CASCADE)
    date_posted = models.DateTimeField(default=timezone.now)
    start_time = models.TimeField()
    end_time = models.TimeField()
    date = models.DateField()

    def __str__(self):
        return self.zone.name

    def get_absolute_url(self):
        return reverse('allocations-create')
