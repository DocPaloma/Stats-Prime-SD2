from rest_framework import viewsets, permissions, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum, Avg, Count, Min, Max, F
from django.db.models.functions import StdDev
from statistics import median
from .models import FarmEvent, FarmReward, FarmSource, FarmDrop
from .serializers import (
    FarmEventSerializer,
    FarmDropSerializer,
    FarmSourceSerializer,
    FarmRewardSerializer,
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
        user = request.user

        # Filtros opcionales
        source_id = request.query_params.get('sourceID')
        item_id = request.query_params.get('itemID')
        start_date = request.query_params.get('startDate')
        end_date = request.query_params.get('endDate')
        user_scope = request.query_params.get('userScope', 'personal')  # personal o global
        group_by = request.query_params.get('groupBy', 'item')  # item, rarity o both

        # Base: eventos del usuario y del juego
        events = FarmEvent.objects.filter(game__id=game_id)
        if user_scope == 'personal':
            events = events.filter(user=user)
        if source_id:
            events = events.filter(source__id=source_id)
        if start_date and end_date:
            events = events.filter(date__range=[start_date, end_date])
        elif start_date:
            events = events.filter(date__gte=start_date)
        elif end_date:
            events = events.filter(date__lte=end_date)

        # Drops relacionados
        drops = FarmDrop.objects.filter(event__in=events)
        if item_id:
            drops = drops.filter(reward__id=item_id)

        # Estadísticas generales
        total_events = events.count()
        total_drops = drops.aggregate(total=Sum('quantity'))['total'] or 0
        avg_drops = drops.aggregate(avg=Avg('quantity'))['avg'] or 0

        # --- Agrupación dinámica ---
        group_fields = []
        if group_by in ['item', 'both']:
            group_fields.append('reward__name')
        if group_by in ['rarity', 'both']:
            group_fields.append('reward__rarity')

        # --- Agregación estadística ---
        drops_grouped = (
            drops.values(*group_fields)
            .annotate(
                avg_quantity=Avg('quantity'),
                min_quantity=Min('quantity'),
                max_quantity=Max('quantity'),
                total_quantity=Sum('quantity'),
                drop_count=Count('id'),
                stddev_quantity=StdDev('quantity'),
            )
        )

        # Cálculo de la mediana (manual porque Django no tiene built-in)
        for g in drops_grouped:
            quantities = list(
                drops.filter(
                    **{k: g[k] for k in group_fields}
                ).values_list('quantity', flat=True)
            )
            g['median_quantity'] = float(median(quantities)) if quantities else 0

        return Response({
            "scope": user_scope,
            "filters": {
                "game_id": game_id,
                "source_id": source_id,
                "date_range": [start_date, end_date],
                "group_by": group_by
            },
            "summary": {
                "total_events": total_events,
                "total_drops": total_drops,
                "avg_drops": round(avg_drops, 2),
            },
            "stats": drops_grouped
        })