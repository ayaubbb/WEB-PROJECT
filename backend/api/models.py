from django.db import models
from django.contrib.auth.models import User
from .managers import BookingManager

class Room(models.Model):
    number = models.CharField(max_length=10)
    capacity = models.IntegerField(default=1)
    
    def __str__(self):
        return f"Room {self.number}"

class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    objects = models.Manager()
    custom = BookingManager()

    
    def __str__(self):
        return f"{self.user.username} - {self.room.number}"
    
    
class Equipment(models.Model):
    name = models.CharField(max_length=100)
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='equipment')
    is_working = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} in {self.room.number}"
    

class IssueReport(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} by {self.user.username}"
    
class CanteenTable(models.Model):
    table_number = models.IntegerField(unique=True)
    seats = models.IntegerField(default=4)
    is_available = models.BooleanField(default=True)
    
    def __str__(self):
        return f"Table #{self.table_number} ({self.seats} seats)"
    
class TableBooking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    table = models.ForeignKey(CanteenTable, on_delete=models.CASCADE)
    booking_date = models.DateField()
    meal_time = models.CharField(max_length=50)
    
    def __str__(self):
        return f"{self.user.username} - Table {self.table.table_number} at {self.meal_time}"
    