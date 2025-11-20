from django.shortcuts import render
from rest_framework import viewsets
# Create your views here.

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone

from .models import (
    Driver, Vehicle, Location, Trip, RouteSegment, Stop,
    LogSheet, LogEntry, FuelEvent, HOSViolation, ELDEvent
)

from .serializers import *

# -------------------------------------------------------------------
# BASIC CRUD VIEWSETS
# -------------------------------------------------------------------

class DriverViewSet(viewsets.ModelViewSet):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer


class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer


class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer


class TripViewSet(viewsets.ModelViewSet):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer

    def retrieve(self, request, *args, **kwargs):
        """Return full trip details: route, logs, stops."""
        self.serializer_class = TripDetailSerializer
        return super().retrieve(request, *args, **kwargs)

    # ---------------------------------------------------------------
    # CUSTOM ENDPOINT: /api/trips/<id>/calculate/
    # ---------------------------------------------------------------
    @action(detail=False, methods=["post"])
    def calculate(self, request):
        """
        INPUT:
        {
            "driverId": 1,
            "vehicleId": 4,
            "currentLocation": {"lat":..., "lon":...},
            "pickup": {"lat":..., "lon":...},
            "dropoff": {"lat":..., "lon":...},
            "currentCycleUsedHours": 12
        }

        OUTPUT:
            Route, stops, logSheets generated automatically
        """
        data = request.data

        # TODO: replace this by your real HOS + routing logic
        # For now: return dummy example for testing the frontend.

        response = {
            "tripId": 999,
            "route": {
                "distanceMiles": 420,
                "durationMinutes": 300,
                "polyline": "encoded_polyline_here"
            },
            "stops": [
                {"type": "pickup", "location": data.get("pickup")}
            ],
            "logSheets": [
                {
                    "date": "2025-11-18",
                    "entries": [
                        {
                            "start": "2025-11-18T08:00:00Z",
                            "end": "2025-11-18T09:00:00Z",
                            "duty": "on_duty_not_driving",
                            "remarks": "Pickup"
                        }
                    ]
                }
            ]
        }

        return Response(response, status=status.HTTP_200_OK)


class RouteSegmentViewSet(viewsets.ModelViewSet):
    queryset = RouteSegment.objects.all()
    serializer_class = RouteSegmentSerializer


class StopViewSet(viewsets.ModelViewSet):
    queryset = Stop.objects.all()
    serializer_class = StopSerializer


class LogSheetViewSet(viewsets.ModelViewSet):
    queryset = LogSheet.objects.all()
    serializer_class = LogSheetSerializer

    # ---------------------------------------------------------------
    # Submit a log sheet to carrier
    # ---------------------------------------------------------------
    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        log = self.get_object()
        log.submitted_to_carrier_at = timezone.now()
        log.save()
        return Response({"status": "submitted"})


class LogEntryViewSet(viewsets.ModelViewSet):
    queryset = LogEntry.objects.all()
    serializer_class = LogEntrySerializer


class FuelEventViewSet(viewsets.ModelViewSet):
    queryset = FuelEvent.objects.all()
    serializer_class = FuelEventSerializer


class HOSViolationViewSet(viewsets.ModelViewSet):
    queryset = HOSViolation.objects.all()
    serializer_class = HOSViolationSerializer


class ELDEventViewSet(viewsets.ModelViewSet):
    queryset = ELDEvent.objects.all()
    serializer_class = ELDEventSerializer
