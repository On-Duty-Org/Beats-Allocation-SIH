from django import forms
from django.forms import ModelForm

from .models import allocations
from police.models import polices
from zones.models import zones


class DateInput(forms.DateInput):
    input_type = 'date'

class TimeInput(forms.TimeInput):
    input_type = 'time'

class AllocationForm(ModelForm):

    class Meta:
        model = allocations
        fields = ['police', 'zone', 'date', 'start_time', 'end_time']
        widgets = {
            'date': DateInput(),
            'start_time': TimeInput(),
            'end_time': TimeInput(),
        }

class PoliceForm(ModelForm):

    class Meta:
        model = polices
        fields = ['name', 'rank']


class ZoneForm(ModelForm):

    class Meta:
        model = zones
        fields = ['name', 'priority', 'url']