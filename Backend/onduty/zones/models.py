from django.db import models

# Create your models here.

class zones(models.Model):

	class Meta:
		verbose_name_plural = 'zones'

	PRIORITY = (
	    ('Low', 'Low'),
	    ('Medium', 'Medium'),
	    ('High', 'High'),
	)
	name = models.CharField(max_length=20)
	priority = models.CharField(max_length=10, choices=PRIORITY, default='Medium')
	url = models.URLField(max_length = 200)

	def __str__(self):
		return self.name
