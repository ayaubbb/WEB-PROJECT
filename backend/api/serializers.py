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

# Сериализатор для Equipment (ModelSerializer)
class EquipmentSerializer(serializers.ModelSerializer):
    room_number = serializers.ReadOnlyField(source='room.number')
    class Meta:
        model = Equipment
        fields = ['id', 'name', 'room', 'room_number', 'is_working']

# Сериализатор для IssueReport (ModelSerializer)
class IssueReportSerializer(serializers.ModelSerializer):
    user_username = serializers.ReadOnlyField(source='user.username')
    equipment_name = serializers.ReadOnlyField(source='equipment.name')
    class Meta:
        model = IssueReport
        fields = ['id', 'user', 'user_username', 'equipment', 'equipment_name', 'title', 'description', 'created_at']
        read_only_fields = ['user', 'created_at']

# Обычный Serializer для создания брони с валидацией
class BookingCreateSerializer(serializers.Serializer):
    room_id = serializers.IntegerField()
    start_time = serializers.DateTimeField()
    end_time = serializers.DateTimeField()

    def validate(self, data):
        if data['start_time'] >= data['end_time']:
            raise serializers.ValidationError("Время начала должно быть раньше окончания")
        # Проверка на пересечение броней (можно добавить позже)
        return data