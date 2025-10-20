from django.urls import path, include
from rest_framework_nested import routers
from .views import FarmEventViewSet, FarmSourceViewSet, GameViewSet

router = routers.SimpleRouter()
router.register(r'games', GameViewSet, basename='games')

games_routers = routers.NestedSimpleRouter(router, r'games', lookup='game')
games_routers.register(r'farm-events', FarmEventViewSet, basename='farm-event')
games_routers.register(r'farm-sources', FarmSourceViewSet, basename='farm-source')


urlpatterns = [
    path('', include(router.urls)),
    path('', include(games_routers.urls)),
]
