from django.db import models
from django.contrib.auth.models import User

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
    
    def __str__(self):
        return f"{self.user.username} - {self.room.number}"