from django.contrib import admin

from ELD.models import Driver, Vehicle, Location, Trip, RouteSegment, Stop, LogSheet, LogEntry, FuelEvent, HOSViolation, \
    ELDEvent

# Register your models here.
admin.site.register(Driver)
admin.site.register(Vehicle)
admin.site.register(Location)
admin.site.register(Trip)
admin.site.register(RouteSegment)
admin.site.register(Stop)
admin.site.register(LogSheet)
admin.site.register(LogEntry)
admin.site.register(FuelEvent)
admin.site.register(HOSViolation)
admin.site.register(ELDEvent)