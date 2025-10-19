from django.db import models
from django.conf import settings

class Game(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class FarmSource(models.Model):
    SOURCE_TYPES = [
        ('JEFE', 'Jefe'),
        ('JEFE_SEMANAL', 'Jefe Semanal'),
        ('DOMINIO', 'Dominio'),
    ]
    name = models.CharField(max_length=150)
    location = models.CharField(max_length=100)
    source_type = models.CharField(max_length=20, choices=SOURCE_TYPES)
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='sources')

    class Meta:
        unique_together = ('name', 'game')

    def __str__(self):
        return f"{self.name} ({self.get_source_type_display()})"


class FarmEvent(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    farm_type = models.CharField(max_length=20, choices=FarmSource.SOURCE_TYPES)
    source = models.ForeignKey(FarmSource, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='farm_events')

    def __str__(self):
        return f"{self.user.username} - {self.source.name} ({self.date})"
