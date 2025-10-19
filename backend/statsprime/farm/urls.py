from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FarmEventViewSet, FarmSourceRewardsView, FarmSourceViewSet

router = DefaultRouter()
router.register(r'games/(?P<game_id>\d+)/farm-events', FarmEventViewSet, basename='farm-events')
router.register(r'games/(?P<game_id>\d+)/farm-sources', FarmSourceViewSet, basename='farm-sources')

urlpatterns = [
    path('', include(router.urls)),

    # Endpoint para listar las recompensas de un jefe dentro de un juego específico
    path(
        'games/<int:game_id>/farm-sources/<int:source_id>/rewards/',
        FarmSourceRewardsView.as_view(),
        name='farm-source-rewards'
    ),
]
