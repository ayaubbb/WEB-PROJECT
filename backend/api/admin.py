from django.contrib import admin
from .models import *

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('id', 'number', 'capacity')
    
@admin.register(Equipment)
class EquipmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'status', 'room')

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'room', 'start_time', 'end_time')
    
@admin.register(IssueReport)
class IssueReportAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'equipment', 'title', 'created_at')

@admin.register(CanteenTable)
class CanteenTableAdmin(admin.ModelAdmin):
    list_display = ('id', 'table_number', 'seats', 'is_available')

@admin.register(TableBooking)
class TableBookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'table', 'booking_date', 'meal_time')