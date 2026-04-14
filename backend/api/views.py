from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from .models import *
from .serializers import *
from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Booking, CanteenTable, IssueReport
from .models import TableBooking
from django.db.models import Count
from django.db.models.functions import TruncDate

class RoomListView(APIView):
    permission_classes = [AllowAny]
 
    def get(self, request):
        rooms = Room.objects.all()
        serializer = RoomSerializer(rooms, many=True)
        return Response(serializer.data)
 
 
class RoomDetailView(generics.RetrieveAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
 
 
class BookingCreateView(APIView):
 
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]
 
    def get(self, request):
        bookings = Booking.objects.select_related('room', 'user').all()
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)
 
    def post(self, request):
        serializer = BookingCreateSerializer(data=request.data)
        if serializer.is_valid():
            room_id = serializer.validated_data['room_id']
            start   = serializer.validated_data['start_time']
            end     = serializer.validated_data['end_time']
            room    = get_object_or_404(Room, id=room_id)
 
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
        return Response({"error": "You can't cancel someone else's reservation."}, status=status.HTTP_403_FORBIDDEN)
    booking.delete()
    return Response({"message": "The reservation has been successfully cancelled."}, status=status.HTTP_200_OK)
 
 
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_issue(request):
    equipment_id = request.data.get('equipment_id')
    title        = request.data.get('title')
    description  = request.data.get('description')
    if not all([equipment_id, title, description]):
        return Response({"error": "equipment_id, title, and description are required."}, status=status.HTTP_400_BAD_REQUEST)
    equipment = get_object_or_404(Equipment, id=equipment_id)
    issue = IssueReport.objects.create(user=request.user, equipment=equipment, title=title, description=description)
    return Response(IssueReportSerializer(issue).data, status=status.HTTP_201_CREATED)
 
 
class UserBookingDetailView(APIView):
    permission_classes = [IsAuthenticated]
 
    def get(self, request):
        bookings = Booking.objects.filter(user=request.user)
        return Response(BookingSerializer(bookings, many=True).data)
 
    def put(self, request, booking_id):
        booking = get_object_or_404(Booking, id=booking_id, user=request.user)
        serializer = BookingSerializer(booking, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
 
 
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        return Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)
 
 
class CanteenTableListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        return Response(CanteenTableSerializer(CanteenTable.objects.all(), many=True).data)
 
 
class TableBookingCreateView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        serializer = TableBookingCreateSerializer(data=request.data)
        if serializer.is_valid():
            table = get_object_or_404(CanteenTable, id=serializer.validated_data['table_id'])
            TableBooking.objects.create(user=request.user, table=table,
                booking_date=serializer.validated_data['booking_date'],
                meal_time=serializer.validated_data['meal_time'])
            return Response({"message": "The table is reserved!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
 
 
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def report_table_issue(request):
    table_id = request.data.get('table_id')
    return Response({"message": f"Complaint about the table {table_id} accepted"}, status=status.HTTP_201_CREATED)
 
 
@api_view(['GET'])
@permission_classes([AllowAny])
def get_table_status(request, table_id):
    table = get_object_or_404(CanteenTable, id=table_id)
    return Response({"table_number": table.table_number, "available": table.is_available})
 
 
@api_view(['GET'])
def get_equipment(request):
    return Response(EquipmentSerializer(Equipment.objects.all(), many=True).data)

@api_view(['GET'])
def dashboard_stats(request):
    active_bookings = Booking.objects.count()

    total_tables = CanteenTable.objects.count()
    available_tables = CanteenTable.objects.filter(is_available=True).count()
    canteen_percent = int((available_tables / total_tables) * 100) if total_tables > 0 else 0
    open_reports = IssueReport.objects.count()

    bookings_by_date = (
        Booking.objects.annotate(date=TruncDate('start_time'))
        .values('date')
        .annotate(count=Count('id'))
        .order_by('date')[:7] 
    )
    canteen_data = list(CanteenTable.objects.values('table_number', 'is_available'))
    
    actions = []
    recent_room_bookings = Booking.objects.order_by('-id')[:3]
    for b in recent_room_bookings:
        actions.append({
            "user": b.user.username,
            "text": f"booked Room {b.room.number}",
            "time": b.start_time.strftime("%H:%M") 
        })

    recent_issues = IssueReport.objects.order_by('-created_at')[:2]
    for issue in recent_issues:
        actions.append({
            "user": issue.user.username,
            "text": f"reported an issue: {issue.title}",
            "time": issue.created_at.strftime("%H:%M")
        })
    return Response({
        "active_bookings": active_bookings,
        "canteen_percent": canteen_percent,
        "open_reports": open_reports,
        "cards": {
            "rooms": active_bookings,
            "canteen": canteen_percent,
            "reports": open_reports
        },
        "charts": {
            "rooms": [item['count'] for item in bookings_by_date],
            "canteen": [100 if t['is_available'] else 20 for t in canteen_data],
            "reports": [5, 10, 2, 8]
        },
        "latest_actions": actions
    })
 

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