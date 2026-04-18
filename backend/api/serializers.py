from rest_framework import serializers
from .models import *
from django.utils import timezone

class RoomSerializer(serializers.ModelSerializer):
    is_busy = serializers.SerializerMethodField()
    current_occupancy = serializers.SerializerMethodField()
    name = serializers.CharField(source='number')
    
    class Meta:
        model = Room
        fields = '__all__'
        
    def get_is_busy(self, obj):
        now = timezone.now()
        count = Booking.objects.filter(room=obj, start_time__lte=now, end_time__gte=now).count()
        return count >= obj.capacity
    
    def get_current_occupancy(self, obj):
        now = timezone.now()
        return Booking.objects.filter(room=obj, start_time__lte=now, end_time__gte=now).count()

class BookingSerializer(serializers.ModelSerializer):
    room_name = serializers.CharField(source='room.number', read_only=True)
    user_name  = serializers.CharField(source='user.username', read_only=True)
    room_capacity = serializers.IntegerField(source='room.capacity', read_only=True)
    
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
    current_occupancy = serializers.SerializerMethodField()
    is_full = serializers.SerializerMethodField()
    
    class Meta:
        model = CanteenTable
        fields = '__all__'
        
    def get_current_occupancy(self, obj):
        date = self.context.get('request').query_params.get('date', timezone.now().date())
        meal_time = self.context.get('request').query_params.get('meal_time', 'Lunch')
        
        return TableBooking.objects.filter(
            table=obj, 
            booking_date=date, 
            meal_time=meal_time
        ).count()

    def get_is_full(self, obj):
        occ = self.get_current_occupancy(obj)
        return occ >= obj.seats
    
    
class TableBookingCreateSerializer(serializers.Serializer):
    table_id = serializers.IntegerField()
    booking_date = serializers.DateField()
    meal_time = serializers.CharField(max_length=50)