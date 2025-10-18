from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FarmEventViewSet

router = DefaultRouter()
router.register(r'games/(?P<game_id>\d+)/farm-events', FarmEventViewSet, basename='farm-events')

urlpatterns = [
    path('', include(router.urls)),
]

