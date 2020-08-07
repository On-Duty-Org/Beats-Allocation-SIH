from django.db import models

# Create your models here.

class polices(models.Model):

	class Meta:
		verbose_name_plural = 'polices'

	name = models.CharField(max_length=10)
	rank = models.CharField(max_length=1)

	def __str__(self):
		return self.name
