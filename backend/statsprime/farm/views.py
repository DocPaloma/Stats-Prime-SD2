from rest_framework import viewsets, permissions, generics
from .models import FarmEvent, FarmReward, FarmSource
from .serializers import (
    FarmEventSerializer,
    FarmDropSerializer,
    FarmSourceSerializer,
    FarmRewardSerializer,  # 👈 agrega esta línea
    GameSerializer,
)


class FarmEventViewSet(viewsets.ModelViewSet):
    serializer_class = FarmEventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        game_id = self.kwargs.get('game_id')
        user = self.request.user
        return FarmEvent.objects.filter(user=user, game__id=game_id)

# Listar las recompensas posibles de un jefe específico dentro de un juego
class FarmSourceRewardsView(generics.ListAPIView):
    serializer_class = FarmRewardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        game_id = self.kwargs.get('game_id')
        source_id = self.kwargs.get('source_id')
        return FarmReward.objects.filter(source__id=source_id, source__game__id=game_id)

class GameViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    permission_classes = [permissions.IsAuthenticated]