from rest_framework import serializers

from .models import (
    Driver, Vehicle, Location, Trip, RouteSegment, Stop,
    LogSheet, LogEntry, FuelEvent, HOSViolation, ELDEvent
)

# -------------------------------------------------------------------
# BASIC SERIALIZERS
# -------------------------------------------------------------------

class DriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = '__all__'


class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = '__all__'


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'


# -------------------------------------------------------------------
# TRIP + RELATED SERIALIZERS
# -------------------------------------------------------------------

class RouteSegmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = RouteSegment
        fields = '__all__'


class StopSerializer(serializers.ModelSerializer):
    location = LocationSerializer(read_only=True)

    class Meta:
        model = Stop
        fields = '__all__'


class LogEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = LogEntry
        fields = '__all__'


class LogSheetSerializer(serializers.ModelSerializer):
    entries = LogEntrySerializer(many=True, read_only=True)

    class Meta:
        model = LogSheet
        fields = '__all__'


# -------------------------------------------------------------------
# TRIP (LIST/CREATE)
# -------------------------------------------------------------------

class TripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = '__all__'


# -------------------------------------------------------------------
# TRIP DETAIL SERIALIZER
# returns: route segments + stops + log sheets
# -------------------------------------------------------------------

class TripDetailSerializer(serializers.ModelSerializer):
    driver = DriverSerializer(read_only=True)
    vehicle = VehicleSerializer(read_only=True)
    origin = LocationSerializer(read_only=True)
    pickup = LocationSerializer(read_only=True)
    dropoff = LocationSerializer(read_only=True)

    route_segments = RouteSegmentSerializer(many=True, read_only=True)
    stops = StopSerializer(many=True, read_only=True)
    log_sheets = LogSheetSerializer(many=True, read_only=True)

    class Meta:
        model = Trip
        fields = '__all__'


# -------------------------------------------------------------------
# EXTRA ENTITIES (Fuel, Violations, ELD Events)
# -------------------------------------------------------------------

class FuelEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = FuelEvent
        fields = '__all__'


class HOSViolationSerializer(serializers.ModelSerializer):
    class Meta:
        model = HOSViolation
        fields = '__all__'


class ELDEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = ELDEvent
        fields = '__all__'
