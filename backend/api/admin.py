from django.contrib import admin
from .models import Room, Equipment, Booking, IssueReport
# Register your models here.
@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('number', 'capacity')
    
@admin.register(Equipment)
class EquipmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'status', 'room')
    
admin.site.register(Booking)
admin.site.register(IssueReport)
