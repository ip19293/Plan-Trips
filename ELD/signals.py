from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Trip
from .services import calcule_estimate_distance_miles


@receiver(post_save, sender=Trip)
def on_trip_saved(sender, instance: Trip, created, **kwargs):
    if created:
        print("✔ Trip created, generating ELD data...")

        # 1) génération des données ELD
        from .services import generate_trip_eld_data
        generate_trip_eld_data(instance)

        # 2) calcul distance estimée et mise à jour du champ total_miles_estimate
        miles = calcule_estimate_distance_miles(instance)

        # mise à jour sans redéclencher post_save
        Trip.objects.filter(id=instance.id).update(total_miles_estimate=miles)