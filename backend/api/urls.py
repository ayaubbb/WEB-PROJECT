from django.urls import path
from django.views.generic import RedirectView
from . import views
from .views import *

urlpatterns = [
    path('', RedirectView.as_view(url='/api/rooms/', permanent=False), name='home'),
    path('rooms/', views.RoomListView.as_view(), name='room-list'),
    path('bookings/', views.BookingCreateView.as_view(), name='booking-create'),
    path('api/canteen/tables/', CanteenTableListView.as_view()),
    path('api/canteen/book/', TableBookingCreateView.as_view()),
    path('bookings/<int:booking_id>/cancel/', views.cancel_booking, name='cancel-booking'),
    path('issues/', views.create_issue, name='create-issue'),
    path('api/canteen/report/', report_table_issue),
    path('api/canteen/status/<int:table_id>/', get_table_status),
]