from rest_framework import viewsets, permissions
from .models import FarmEvent
from .serializers import FarmEventSerializer, FarmSourceSerializer, GameSerializer

class FarmEventViewSet(viewsets.ModelViewSet):
    serializer_class = FarmEventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        game_id = self.kwargs.get('game_id')
        user = self.request.user
        return FarmEvent.objects.filter(user=user, game__id=game_id)

class FarmSourceViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = FarmSourceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        game_id = self.kwargs.get('game_id')
        return FarmEvent.objects.filter(game__id=game_id, source__isnull=False)
    

class GameViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    permission_classes = [permissions.IsAuthenticated]