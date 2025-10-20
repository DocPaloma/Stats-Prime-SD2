from rest_framework import viewsets, permissions, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum, Avg, Count, Min, Max, F, StdDev, Prefetch
from statistics import median
from .models import FarmEvent, FarmReward, FarmSource, FarmDrop
from .serializers import (
    FarmEventSerializer,
    FarmDropSerializer,
    FarmSourceSerializer,
    FarmRewardSerializer,
    GameSerializer,
)

# -------------------------------
# Eventos de farmeo
# -------------------------------
class FarmEventViewSet(viewsets.ModelViewSet):
    serializer_class = FarmEventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        game_id = self.kwargs.get('game_id')
        user = self.request.user
        return FarmEvent.objects.filter(user=user, game__id=game_id)
    
# -------------------------------
# Listar las recompensas posibles de un jefe específico dentro de un juego
# -------------------------------
class FarmSourceRewardsView(generics.ListAPIView):
    serializer_class = FarmRewardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        game_id = self.kwargs.get('game_id')
        source_id = self.kwargs.get('source_id')
        return FarmReward.objects.filter(source__id=source_id, source__game__id=game_id)

# -------------------------------
# Estadísticas generales de farmeo
# -------------------------------
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

        # Si no hay fechas, calcular automáticamente el rango real
        if not start_date or not end_date:
            date_bounds = events.aggregate(
                min_date=Min('date'),
                max_date=Max('date')
            )
            start_date = start_date or (date_bounds['min_date'].isoformat() if date_bounds['min_date'] else None)
            end_date = end_date or (date_bounds['max_date'].isoformat() if date_bounds['max_date'] else None)

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
    
# --------------------
# Probabilidad de drop
# --------------------
class DropRateStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, game_id):
        user = request.user
        source_id = request.query_params.get("sourceID")
        item_id = request.query_params.get("itemID")

        if not source_id:
            return Response({"error": "Se requiere el parámetro sourceID."}, status=400)

        # Eventos del usuario para esa fuente
        total_events = FarmEvent.objects.filter(
            user=user, game__id=game_id, source__id=source_id
        ).count()

        if total_events == 0:
            return Response({
                "message": "No hay eventos registrados para esta fuente.",
                "drop_rate": 0
            })

        # Eventos en los que cayó el ítem (si se especifica)
        drops_qs = FarmDrop.objects.filter(
            event__user=user,
            event__game__id=game_id,
            event__source__id=source_id
        )

        if item_id:
            drops_qs = drops_qs.filter(reward__id=item_id)

        # Número de eventos únicos donde cayó ese ítem
        events_with_item = drops_qs.values("event").distinct().count()

        # Drop rate base
        drop_rate = events_with_item / total_events if total_events else 0

        # --- Drop rate por rareza ---
        rarity_data = drops_qs.values("reward__rarity").annotate(
            event_count=Count("event", distinct=True)
        )

        drop_rate_by_rarity = [
            {
                "rarity": r["reward__rarity"],
                "drop_rate": round(r["event_count"] / total_events, 3)
            }
            for r in rarity_data
        ]

        return Response({
            "game_id": game_id,
            "source_id": source_id,
            "item_id": item_id,
            "total_events": total_events,
            "events_with_item": events_with_item,
            "drop_rate": round(drop_rate, 3),
            "drop_rate_by_rarity": drop_rate_by_rarity
        })
    
# ---------------------
# Historial de eventos
# ---------------------
class FarmHistoryView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = FarmEventSerializer

    def get_queryset(self):
        user_param = self.request.query_params.get('user')
        game_id = self.request.query_params.get('gameID')
        source_id = self.request.query_params.get('sourceID')
        type_param = self.request.query_params.get('type')

        # Si se pasa ?user=, buscar ese usuario; si no, usar el autenticado
        if user_param:
            from django.contrib.auth import get_user_model
            User = get_user_model()
            try:
                user = User.objects.get(username=user_param)
            except User.DoesNotExist:
                return FarmEvent.objects.none()
        else:
            user = self.request.user

        # Base query
        queryset = FarmEvent.objects.filter(user=user).order_by('-date')

        # Filtros opcionales
        if game_id:
            queryset = queryset.filter(game__id=game_id)
        if source_id:
            queryset = queryset.filter(source__id=source_id)
        if type_param:
            queryset = queryset.filter(source__type__iexact=type_param)

        # Prefetch para traer los drops relacionados en una sola consulta
        return queryset.prefetch_related(
            Prefetch('farmdrop_set', queryset=FarmDrop.objects.select_related('reward'))
        )
    
# -----------------------
# Vista de Juegos (nueva)
# -----------------------
class GameViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    permission_classes = [permissions.IsAuthenticated]
