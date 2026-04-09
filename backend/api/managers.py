from django.db import models
from django.utils import timezone

class BookingManager(models.Manager):
    def today_bookings(self):
        today = timezone.now().date()
        start = timezone.make_aware(timezone.datetime.combine(today, timezone.datetime.min.time()))
        end = timezone.make_aware(timezone.datetime.combine(today, timezone.datetime.max.time()))
        return self.filter(start_time__gte=start, end_time__lte=end)

    def for_user(self, user):
        return self.filter(user=user)