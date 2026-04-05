from django.db import models
from django.contrib.auth.models import User
# Create your models here.
class Room(models.Model):
    number = models.CharField(max_length=10)
    capacity = models.IntegerField(default=1)
    
    def __str__(self):
        return f"Room {self.number}"

class Equipment(models.Model):
    name = models.CharField(max_length=100)
    status = models.CharField(max_length=50, default="Available")
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='equipments')
    
    def __str__(self):
        return self.name

class Booking (models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    
    def __str__(self):
        return f"{self.user.username} - {self.room.number}"

class IssueReport(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.title

