from rest_framework import serializers
from .models import Room, Booking

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
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