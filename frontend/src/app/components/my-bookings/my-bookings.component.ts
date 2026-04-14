import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-my-bookings',
  imports: [DatePipe],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.css',
})
export class MyBookingsComponent {
  bookings: any[] = [];
  editingBookingId: number | null = null; 

  constructor(private http: HttpClient) {
    this.loadBookings();
  }

  loadBookings() {
    this.http.get<any[]>('http://127.0.0.1:8000/my-bookings/').subscribe(data => {
      this.bookings = data;
    });
  }

  saveChanges(id: number, newTime: string) {
    this.http.put(`http://127.0.0.1:8000/bookings/${id}/update/`, {
      start_time: newTime
    }).subscribe(() => {
      this.editingBookingId = null;
      this.loadBookings(); 
    });
  }
}