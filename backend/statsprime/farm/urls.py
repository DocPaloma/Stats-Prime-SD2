from django.urls import path, include
from rest_framework_nested import routers
from .views import FarmEventViewSet, FarmSourceRewardsView, FarmSourceViewSet, FarmStatsView, DropRateStatsView, FarmHistoryView

router = routers.SimpleRouter()
router.register(r'games', GameViewSet, basename='games')

games_routers = routers.NestedSimpleRouter(router, r'games', lookup='game')
games_routers.register(r'farm-events', FarmEventViewSet, basename='farm-event')
games_routers.register(r'farm-sources', FarmSourceViewSet, basename='farm-source')


urlpatterns = [
    path('', include(router.urls)),
    path('', include(games_routers.urls)),

    # Endpoint para listar las recompensas de un jefe dentro de un juego específico
    path('games/<int:game_id>/farm-sources/<int:source_id>/rewards/', FarmSourceRewardsView.as_view(),name='farm-source-rewards'),
    path('games/<int:game_id>/stats/', FarmStatsView.as_view(), name='farm-stats'),
    path('games/<int:game_id>/stats/drop-rate/', DropRateStatsView.as_view(), name='drop-rate-stats'),

    path('games/<int:game_id>/farm-events/history/', FarmHistoryView.as_view(), name='farm-history'),
]
