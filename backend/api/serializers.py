from rest_framework import serializers
from .models import *
from django.utils import timezone

class RoomSerializer(serializers.ModelSerializer):
    is_busy = serializers.SerializerMethodField()
    name = serializers.CharField(source='number')
    
    class Meta:
        model = Room
        fields = '__all__'
        
    def get_is_busy(self, obj):
        now = timezone.now()
        return Booking.objects.filter(
            room=obj,
            start_time__lt=now,
            end_time__gt=now
        ).exists()

class BookingSerializer(serializers.ModelSerializer):
    room_name = serializers.CharField(source='room.number', read_only=True)
    user_name  = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = Booking
        fields = '__all__'

class RoomStatisticsSerializer(serializers.Serializer):
    total_rooms = serializers.IntegerField()
    average_capacity = serializers.FloatField()

class IssueReportFormSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=200)
    description = serializers.CharField()
    user_id = serializers.IntegerField()

class EquipmentSerializer(serializers.ModelSerializer):
    room_number = serializers.ReadOnlyField(source='room.number')
    class Meta:
        model = Equipment
        fields = ['id', 'name', 'room', 'room_number', 'is_working']

class IssueReportSerializer(serializers.ModelSerializer):
    user_username = serializers.ReadOnlyField(source='user.username')
    equipment_name = serializers.ReadOnlyField(source='equipment.name')
    class Meta:
        model = IssueReport
        fields = ['id', 'user', 'user_username', 'equipment', 'equipment_name', 'title', 'description', 'created_at']
        read_only_fields = ['user', 'created_at']

class BookingCreateSerializer(serializers.Serializer):
    room_id = serializers.IntegerField()
    start_time = serializers.DateTimeField()
    end_time = serializers.DateTimeField()
    
    def validate_start_time(self, value):
        if value < timezone.now():
            raise serializers.ValidationError("You can't book for past times!")
        return value
    
    def validate(self, data):
        if data['start_time'] >= data['end_time']:
            raise serializers.ValidationError("Start time must be before end time")
        return data
    
class CanteenTableSerializer(serializers.ModelSerializer):
    class Meta:
        model = CanteenTable
        fields = '__all__'
        
class TableBookingCreateSerializer(serializers.Serializer):
    table_id = serializers.IntegerField()
    booking_date = serializers.DateField()
    meal_time = serializers.CharField(max_length=50)