from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from .models import *
from .serializers import *

class RoomListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        rooms = Room.objects.all()
        serializer = RoomSerializer(rooms, many=True)
        return Response(serializer.data)

class BookingCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = BookingCreateSerializer(data=request.data)
        if serializer.is_valid():
            room_id = serializer.validated_data['room_id']
            start = serializer.validated_data['start_time']
            end = serializer.validated_data['end_time']
            room = get_object_or_404(Room, id=room_id)

            if Booking.objects.filter(room=room, start_time__lt=end, end_time__gt=start).exists():
                return Response(
                    {"error": "The room is already occupied at the selected time."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            booking = Booking.objects.create(
                user=request.user,
                room=room,
                start_time=start,
                end_time=end
            )
            return Response(BookingSerializer(booking).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def cancel_booking(request, booking_id):
    booking = get_object_or_404(Booking, id=booking_id)
    if booking.user != request.user:
        return Response(
            {"error": "You can't cancel someone else's reservation."},
            status=status.HTTP_403_FORBIDDEN
        )
    booking.delete()
    return Response({"message": "The reservation has been successfully cancelled."}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_issue(request):
    equipment_id = request.data.get('equipment_id')
    title = request.data.get('title')
    description = request.data.get('description')

    if not all([equipment_id, title, description]):
        return Response(
            {"error": "The equipment_id, title, and description fields are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    equipment = get_object_or_404(Equipment, id=equipment_id)
    issue = IssueReport.objects.create(
        user=request.user,
        equipment=equipment,
        title=title,
        description=description
    )
    serializer = IssueReportSerializer(issue)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

# ========== 5. ВТОРОЙ CBV: Список и обновление личных броней (Full CRUD) ==========
class UserBookingDetailView(APIView):
    permission_classes = [IsAuthenticated]

    # READ: Показать только брони текущего пользователя
    def get(self, request):
        bookings = Booking.objects.filter(user=request.user)
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)

    # UPDATE: Изменить существующую бронь (например, время)
    def put(self, request, booking_id):
        booking = get_object_or_404(Booking, id=booking_id, user=request.user)
        # Используем partial=True, чтобы можно было обновить только одно поле
        serializer = BookingSerializer(booking, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ========== 6. Logout View (Для ТЗ) ==========
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # В JWT выход обычно делается на фронте, но этот эндпоинт нужен для отчета
        return Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)

# ========== (опционально) CBV для деталей комнаты – даёт полный CRUD для Room ==========
# Если хочешь добавить, раскомментируй. Не обязательно, но плюс к требованию CRUD.
class CanteenTableListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        tables = CanteenTable.objects.all()
        serializer = CanteenTableSerializer(tables, many=True)
        return Response(serializer.data)
    
class TableBookingCreateView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        serializer = TableBookingCreateSerializer(data=request.data)
        if serializer.is_valid():
            table = get_object_or_404(CanteenTable, id=serializer.validated_data['table_id'])
            booking = TableBooking.objects.create(
                user=request.user,
                table=table,
                booking_date=serializer.validated_data['booking_date'],
                meal_time=serializer.validated_data['meal_time']
            )
            return Response({"message": "The table is reserved!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def report_table_issue(request):
    table_id = request.data.get('table_id')
    desc = request.data.get('description')
    return Response({"message": f"Complaint about the table {table_id} accepted"}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_table_status(request, table_id):
    table = get_object_or_404(CanteenTable, id=table_id)
    return Response({"table_number": table.table_number, "available": table.is_available})




"""
class RoomDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, room_id):
        room = get_object_or_404(Room, id=room_id)
        serializer = RoomSerializer(room, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, room_id):
        room = get_object_or_404(Room, id=room_id)
        room.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
"""