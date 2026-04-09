from django.urls import path
from django.views.generic import RedirectView
from . import views

urlpatterns = [
    # Редирект с /api/ на /api/rooms/
    path('', RedirectView.as_view(url='/api/rooms/', permanent=False), name='home'),
    
    path('rooms/', views.RoomListView.as_view(), name='room-list'),
    path('bookings/', views.BookingCreateView.as_view(), name='booking-create'),
    path('bookings/<int:booking_id>/cancel/', views.cancel_booking, name='cancel-booking'),
    path('issues/', views.create_issue, name='create-issue'),
]