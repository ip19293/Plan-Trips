from django.conf import settings
from django.db import models
from django.db.models import JSONField
from django.utils import timezone


class Driver(models.Model):
    HOD_CYCLE_CHOICES = [
        ('60_7', '60 hours / 7 days'),
        ('70_8', '70 hours / 8 days'),
    ]

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='driver_profile',
                                null=True, blank=True)
    full_name = models.CharField(max_length=200)
    email = models.EmailField(blank=True, null=True)
    license_number = models.CharField(max_length=100, blank=True, null=True)
    home_time_zone = models.CharField(max_length=64, default='UTC')
    hod_cycle_type = models.CharField(max_length=8, choices=HOD_CYCLE_CHOICES, default='70_8')
    short_haul_eligible = models.BooleanField(default=False)
    cdl_required = models.BooleanField(default=True)
    last_34_restart_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['full_name']

    def __str__(self):
        return self.full_name


class Vehicle(models.Model):
    driver = models.ForeignKey(Driver, on_delete=models.SET_NULL, related_name='vehicles', null=True, blank=True)
    registration = models.CharField(max_length=64)
    vin = models.CharField(max_length=64, blank=True, null=True)
    odometer = models.PositiveIntegerField(default=0, help_text='miles')
    max_range_miles = models.PositiveIntegerField(default=1000, help_text='approx range miles between fueling')
    active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.registration} ({self.driver})"


class Location(models.Model):
    name = models.CharField(max_length=200, blank=True)
    lat = models.FloatField()
    lon = models.FloatField()
    address = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name or f"{self.lat},{self.lon}"


class Trip(models.Model):
    STATUS_CHOICES = [
        ('planned', 'Planned'),
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE, related_name='trips')
    vehicle = models.ForeignKey(Vehicle, on_delete=models.SET_NULL, null=True, blank=True, related_name='trips')
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField(null=True, blank=True)
    origin = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True, blank=True, related_name='trip_origins')
    pickup = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True, blank=True, related_name='trip_pickups')
    dropoff = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True, blank=True,
                                related_name='trip_dropoffs')
    total_miles_estimate = models.PositiveIntegerField(null=True, blank=True)
    assumptions = JSONField(default=dict, blank=True)  # e.g. {'fuelEveryMiles':1000, 'pickupDurationMinutes':60}
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planned')

    # HOS specific flags
    is_interstate = models.BooleanField(default=True)
    assumed_adverse_conditions = models.BooleanField(default=False)
    short_haul_exception_used = models.CharField(max_length=32, blank=True, null=True)
    time_base = models.CharField(max_length=64, default='UTC')  # timezone string used for 24h logs

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Trip #{self.id} - {self.driver} ({self.status})"


class RouteSegment(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='route_segments')
    index = models.PositiveIntegerField(default=0)
    start_location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True, blank=True,
                                       related_name='segment_starts')
    end_location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True, blank=True,
                                     related_name='segment_ends')
    distance_miles = models.FloatField(default=0.0)
    duration_minutes = models.PositiveIntegerField(default=0)
    polyline = models.TextField(blank=True, null=True)  # encoded polyline or GeoJSON

    class Meta:
        ordering = ['trip', 'index']

    def __str__(self):
        return f"Segment {self.index} of Trip {self.trip_id}"


class Stop(models.Model):
    STOP_TYPE_CHOICES = [
        ('rest', 'Rest'),
        ('fuel', 'Fuel'),
        ('pickup', 'Pickup'),
        ('dropoff', 'Dropoff'),
        ('other', 'Other'),
    ]
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='stops')
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True, blank=True)
    type = models.CharField(max_length=16, choices=STOP_TYPE_CHOICES, default='other')
    est_arrival = models.DateTimeField(null=True, blank=True)
    est_departure = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.type} @ {self.location} (Trip {self.trip_id})"


class LogSheet(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='log_sheets')
    date = models.DateField()
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE, related_name='log_sheets')
    # FMCSA required fields
    date_start_time_base = models.DateTimeField(null=True, blank=True)
    vehicle_numbers = JSONField(default=list, blank=True)
    carrier_name = models.CharField(max_length=255, blank=True)
    carrier_address = models.TextField(blank=True)
    total_miles = models.PositiveIntegerField(default=0)
    shipping_doc_numbers = models.TextField(blank=True, null=True)  # could be a comma list
    driver_signature = models.CharField(max_length=255, blank=True, null=True)
    co_driver_name = models.CharField(max_length=255, blank=True, null=True)
    submitted_to_carrier_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('trip', 'date')
        ordering = ['-date']

    def __str__(self):
        return f"LogSheet {self.date} (Trip {self.trip_id})"


class LogEntry(models.Model):
    DUTY_CHOICES = [
        ('off', 'Off Duty'),
        ('sleeper', 'Sleeper Berth'),
        ('driving', 'Driving'),
        ('on_duty_not_driving', 'On-Duty Not Driving'),
    ]

    logsheet = models.ForeignKey(LogSheet, on_delete=models.CASCADE, related_name='entries')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    duty_status = models.CharField(max_length=24, choices=DUTY_CHOICES)
    miles_driven = models.FloatField(default=0.0)
    remarks = models.TextField(blank=True, null=True)  # location note or reason
    is_personal_conveyance = models.BooleanField(default=False)
    is_yard_move = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['start_time']

    def duration_minutes(self):
        delta = self.end_time - self.start_time
        return int(delta.total_seconds() / 60)

    def __str__(self):
        return f"{self.duty_status} {self.start_time} -> {self.end_time}"


class FuelEvent(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='fuel_events')
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True, blank=True)
    datetime = models.DateTimeField()
    gallons = models.FloatField(null=True, blank=True)
    odometer = models.PositiveIntegerField(null=True, blank=True)

    def __str__(self):
        return f"Fuel @ {self.datetime} ({self.gallons} gal)"


class HOSViolation(models.Model):
    VIOLATION_TYPE = [
        ('driving_limit', 'Driving time limit exceeded'),
        ('window_limit', '14-hour window exceeded'),
        ('rollover_limit', '60/70 hour limit exceeded'),
        ('no_34_restart', '34-hour restart missing when expected'),
        ('no_break', '30 minute break missing'),
        ('other', 'Other'),
    ]
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='hos_violations', null=True, blank=True)
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE, related_name='hos_violations')
    violation_type = models.CharField(max_length=32, choices=VIOLATION_TYPE)
    detected_at = models.DateTimeField(default=timezone.now)
    details = models.TextField(blank=True, null=True)
    acknowledged = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.violation_type} for {self.driver} at {self.detected_at}"


class ELDEvent(models.Model):
    """
    Timestamped events coming from an ELD device or simulated ELD.
    Useful for audit and syncing with LogEntry.
    """
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='eld_events', null=True, blank=True)
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE, related_name='eld_events')
    timestamp = models.DateTimeField()
    event_type = models.CharField(max_length=128)  # e.g., 'engine_on', 'engine_off', 'status_change'
    payload = JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"ELD {self.event_type} @ {self.timestamp}"
