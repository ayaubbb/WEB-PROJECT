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
    path('my-bookings/', views.UserBookingDetailView.as_view(), name='my-bookings'),
    path('bookings/<int:booking_id>/update/', views.UserBookingDetailView.as_view(), name='booking-update'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('api/canteen/report/', report_table_issue),
    path('api/canteen/status/<int:table_id>/', get_table_status),
    path('equipment/', views.get_equipment),
    path('rooms/<int:pk>/', views.RoomDetailView.as_view(), name='room-detail'),
]