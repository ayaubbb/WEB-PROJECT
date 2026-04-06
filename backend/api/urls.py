from django.urls import path
from django.views.generic import RedirectView
from .views import RoomListView

urlpatterns = [
    path('', RedirectView.as_view(url='/api/rooms/', permanent=False), name='home'),
    path('api/rooms/', RoomListView.as_view(), name='room-list'),
]