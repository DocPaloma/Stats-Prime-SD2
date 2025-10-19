from rest_framework import viewsets, permissions, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum, Avg, Count
from .models import FarmEvent, FarmReward, FarmSource
from .serializers import (
    FarmEventSerializer,
    FarmDropSerializer,
    FarmSourceSerializer,
    FarmRewardSerializer,  # 👈 agrega esta línea
)

class FarmEventViewSet(viewsets.ModelViewSet):
    serializer_class = FarmEventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        game_id = self.kwargs.get('game_id')
        user = self.request.user
        return FarmEvent.objects.filter(user=user, game__id=game_id)


# Listar todos los jefes (fuentes) del juego seleccionado
class FarmSourceViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = FarmSourceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        game_id = self.kwargs.get('game_id')
        return FarmSource.objects.filter(game__id=game_id).prefetch_related('rewards')


# Listar las recompensas posibles de un jefe específico dentro de un juego
class FarmSourceRewardsView(generics.ListAPIView):
    serializer_class = FarmRewardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        game_id = self.kwargs.get('game_id')
        source_id = self.kwargs.get('source_id')
        return FarmReward.objects.filter(source__id=source_id, source__game__id=game_id)

class FarmStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, game_id):
        from .models import FarmEvent, FarmDrop  # 👈 importa dentro para evitar ciclos
        user = request.user

        # Filtros opcionales
        source_id = request.query_params.get('sourceID')
        item_id = request.query_params.get('itemID')
        start_date = request.query_params.get('startDate')
        end_date = request.query_params.get('endDate')

        # Base: eventos del usuario y del juego
        events = FarmEvent.objects.filter(user=user, game__id=game_id)
        if source_id:
            events = events.filter(source__id=source_id)
        if start_date and end_date:
            events = events.filter(date__range=[start_date, end_date])

        # Drops relacionados
        drops = FarmDrop.objects.filter(event__in=events)
        if item_id:
            drops = drops.filter(reward__id=item_id)

        # Estadísticas generales
        total_events = events.count()
        total_drops = drops.aggregate(total=Sum('quantity'))['total'] or 0
        avg_drops = drops.aggregate(avg=Avg('quantity'))['avg'] or 0

        # Estadísticas agrupadas por ítem
        drops_by_item = drops.values('reward__name').annotate(
            total_quantity=Sum('quantity'),
            avg_quantity=Avg('quantity'),
            event_count=Count('event', distinct=True)
        )

        return Response({
            "total_events": total_events,
            "total_drops": total_drops,
            "avg_drops": round(avg_drops, 2),
            "drops_by_item": drops_by_item,
        })