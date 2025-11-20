from rest_framework import routers
from django.urls import path, include

from .views import (
    DriverViewSet, VehicleViewSet, LocationViewSet,
    TripViewSet, RouteSegmentViewSet, StopViewSet,
    LogSheetViewSet, LogEntryViewSet, FuelEventViewSet,
    HOSViolationViewSet, ELDEventViewSet
)

router = routers.DefaultRouter()
router.register(r'drivers', DriverViewSet)
router.register(r'vehicles', VehicleViewSet)
router.register(r'locations', LocationViewSet)
router.register(r'trips', TripViewSet)
router.register(r'route-segments', RouteSegmentViewSet)
router.register(r'stops', StopViewSet)
router.register(r'logsheets', LogSheetViewSet)
router.register(r'logentries', LogEntryViewSet)
router.register(r'fuelevents', FuelEventViewSet)
router.register(r'violations', HOSViolationViewSet)
router.register(r'eld-events', ELDEventViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
