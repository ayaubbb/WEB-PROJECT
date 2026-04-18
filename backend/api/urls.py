from django.urls import path
from django.views.generic import RedirectView
from . import views
from .views import *

urlpatterns = [
    path('', RedirectView.as_view(url='/api/rooms/', permanent=False), name='home'),
    path('rooms/', views.RoomListView.as_view(), name='room-list'),
    path('rooms/<int:pk>/', views.RoomDetailView.as_view(), name='room-detail'),
    path('bookings/', views.BookingCreateView.as_view(), name='booking-list-create'),
    path('bookings/<int:booking_id>/cancel/', views.cancel_booking, name='cancel-booking'),
    path('bookings/<int:booking_id>/update/', views.UserBookingDetailView.as_view(), name='booking-update'),
    path('my-bookings/', views.UserBookingDetailView.as_view(), name='my-bookings'),
    path('equipment/', views.get_equipment, name='equipment-list'),
    path('issues/', views.create_issue, name='create-issue'),
    path('api/canteen/tables/', CanteenTableListView.as_view()),
    path('api/canteen/book/', TableBookingCreateView.as_view()),
    path('api/canteen/report/', report_table_issue),
    path('api/canteen/status/<int:table_id>/', get_table_status),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('dashboard-stats/', views.dashboard_stats, name='dashboard-stats'),
    path('reports/', views.issue_reports_api, name='issue_reports_api'),
]