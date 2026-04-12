import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-canteen',
  templateUrl: './canteen.component.html',
  styleUrls: ['./canteen.component.css']
})
export class CanteenComponent {
  tables = [
    { id: 1, number: 'Table 1', is_occupied: false },
    { id: 2, number: 'Table 2', is_occupied: true },
    { id: 3, number: 'Table 3', is_occupied: false },
  ];

  constructor(private http: HttpClient) {}

  bookTable(table: any) {
    const bookingData = {
      room_id: table.id, 
      start_time: new Date().toISOString(),
      end_time: new Date(Date.now() + 3600000).toISOString() 
    };

    this.http.post('http://127.0.0.1:8000/bookings/', bookingData).subscribe({
      next: () => {
        table.is_occupied = true; 
          alert(`${table.number} successfully booked!`);
      },
      error: (err) => alert('Booking error')
    });
  }
}