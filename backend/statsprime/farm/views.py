from rest_framework import viewsets, permissions
from .models import FarmEvent
from .serializers import FarmEventSerializer

class FarmEventViewSet(viewsets.ModelViewSet):
    serializer_class = FarmEventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        game_id = self.kwargs.get('game_id')
        user = self.request.user
        return FarmEvent.objects.filter(user=user, game__id=game_id)
