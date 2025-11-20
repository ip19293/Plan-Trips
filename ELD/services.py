from math import radians, sin, cos, sqrt, atan2

from datetime import timedelta
from django.utils import timezone

from ELD.models import RouteSegment, Stop, ELDEvent, HOSViolation, Location, LogSheet, LogEntry, Trip

HOS_RULES = {
    # exemples (à adapter)
    'max_drive_hours_single_shift': 11 * 60,  # minutes
    'max_shift_window': 14 * 60,              # minutes
    'required_break_after_driving': 30,       # minutes
    'max_cycle_hours_70_8': 70 * 60,
    'max_cycle_hours_60_7': 60 * 60,
}
def haversine(lat1, lon1, lat2, lon2):
    """Calculer la distance en miles entre deux points lat/lon"""
    R = 3958.8  # miles
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat/2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1-a))
    return R * c


def calcule_estimate_distance_miles(trip: Trip):
    """Calculer la distance totale estimée d'un Trip"""
    total_miles = 0

    # récupérer les Location (ForeignKey)
    origin = trip.origin
    pickup = trip.pickup
    dropoff = trip.dropoff

    segments = [(origin, pickup), (pickup, dropoff)]

    for start, end in segments:
        if start and end:
            total_miles += haversine(start.lat, start.lon, end.lat, end.lon)

    return total_miles

def generate_trip_eld_data(trip):
    """
    Ébauche :
      1) calculer route segments (ici on prend direct : origin->pickup->dropoff)
      2) estimer durée de chaque segment (si tu as polyline/OSRM: remplacer)
      3) créer stops (pickup/dropoff, et pauses planifiées)
      4) simuler le timeline des statuts et créer LogSheet + LogEntry + ELDEvent
      5) détecter violations HOS
    """

    # --- 1) segments simples ---
    pts = [
        ('origin', trip.origin),
        ('pickup', trip.pickup),
        ('dropoff', trip.dropoff)
    ]
    segments = []
    for i in range(len(pts)-1):
        start = pts[i][1]
        end = pts[i+1][1]
        if not (start and end):
            continue
        seg = RouteSegment.objects.create(
            trip=trip,
            index=i,
            start_location=start,
            end_location=end,
            distance_miles=estimate_distance_miles(start, end),
            duration_minutes=estimate_duration_minutes(start, end),
            polyline=None
        )
        segments.append(seg)

    # --- 2) stops: pickup & dropoff (et optionnellement ajouter des rests every X hours) ---
    stops_created = []
    # add pickup
    if trip.pickup:
        stops_created.append(Stop.objects.create(trip=trip, location=trip.pickup, type='pickup',
                                                 est_arrival=None, est_departure=None))
    if trip.dropoff:
        stops_created.append(Stop.objects.create(trip=trip, location=trip.dropoff, type='dropoff',
                                                 est_arrival=None, est_departure=None))

    # --- 3) simulate timeline (very simplified) ---
    # start_time = trip.start_datetime (aware)
    cur_time = trip.start_datetime
    total_drive_minutes = 0
    log_entries = []
    # iterate segments and create driving entries, with breaks when needed
    for seg in segments:
        remaining = seg.duration_minutes
        while remaining > 0:
            # drive chunk until either required break threshold or remaining
            drive_chunk = min(remaining, HOS_RULES['max_drive_hours_single_shift'] - (total_drive_minutes % HOS_RULES['max_drive_hours_single_shift']))
            # create LogEntry driving
            entry_end = cur_time + timedelta(minutes=drive_chunk)
            log = LogEntry.objects.create(
                logsheet=get_or_create_logsheet_for_date(trip, cur_time.date()),
                start_time=cur_time,
                end_time=entry_end,
                duty_status='driving',
                miles_driven=seg.distance_miles * (drive_chunk / seg.duration_minutes),
            )
            log_entries.append(log)
            # create ELD event(s)
            ELDEvent.objects.create(trip=trip, driver=trip.driver, timestamp=cur_time, event_type='drive_start', payload={'segment': seg.id})
            ELDEvent.objects.create(trip=trip, driver=trip.driver, timestamp=entry_end, event_type='drive_stop', payload={'segment': seg.id})
            # update times
            cur_time = entry_end
            total_drive_minutes += drive_chunk
            remaining -= drive_chunk

            # if need break (here if we reached required break threshold), add break
            if total_drive_minutes % HOS_RULES['max_drive_hours_single_shift'] == 0 and remaining > 0:
                # add 30-min break
                break_start = cur_time
                break_end = cur_time + timedelta(minutes=HOS_RULES['required_break_after_driving'])
                LogEntry.objects.create(
                    logsheet=get_or_create_logsheet_for_date(trip, break_start.date()),
                    start_time=break_start,
                    end_time=break_end,
                    duty_status='off',
                    miles_driven=0,
                    remarks='Auto-rest after driving chunk'
                )
                ELDEvent.objects.create(trip=trip, driver=trip.driver, timestamp=break_start, event_type='rest_start', payload={})
                ELDEvent.objects.create(trip=trip, driver=trip.driver, timestamp=break_end, event_type='rest_end', payload={})
                cur_time = break_end

    # --- 4) detect simple HOS violation (example: total drive > cycle limit) ---
    cycle_limit = HOS_RULES['max_cycle_hours_70_8'] if trip.driver.hod_cycle_type == '70_8' else HOS_RULES['max_cycle_hours_60_7']
    if total_drive_minutes > cycle_limit:
        HOSViolation.objects.create(trip=trip, driver=trip.driver, violation_type='rollover_limit',
                                    details=f"Total drive minutes {total_drive_minutes} > cycle {cycle_limit}")

    # return some summary
    return {
        'segments': [s.id for s in segments],
        'stops': [s.id for s in stops_created],
        'log_entries_count': len(log_entries)
    }


# helpers (replace by real geo logic)
def estimate_distance_miles(a: Location, b: Location):
    """
    Calcule la distance en miles entre deux Location (lat/lon) avec Haversine
    """
    if not (a and b):
        return 0.0

    lat1, lon1 = a.lat, a.lon
    lat2, lon2 = b.lat, b.lon
    R = 3958.8  # rayon de la Terre en miles

    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)

    h = sin(dlat/2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2)**2
    c = 2 * atan2(sqrt(h), sqrt(1-h))
    return R * c

def estimate_duration_minutes(a: Location, b: Location):
    # stub: distance / 50mph * 60
    d = estimate_distance_miles(a,b)
    return int((d / 50.0) * 60)

def get_or_create_logsheet_for_date(trip, date):
    logsheet, _ = LogSheet.objects.get_or_create(trip=trip, date=date, driver=trip.driver)
    return logsheet
