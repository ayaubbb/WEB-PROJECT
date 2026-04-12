import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-canteen',
  templateUrl: './canteen.component.html',
  styleUrls: ['./canteen.component.css']
})
export class CanteenComponent {
  // Список столов (в реальности придет с бэкенда)
  tables = [
    { id: 1, number: 'Стол 1', is_occupied: false },
    { id: 2, number: 'Стол 2', is_occupied: true },
    { id: 3, number: 'Стол 3', is_occupied: false },
  ];

  constructor(private http: HttpClient) {}

  bookTable(table: any) {
    const bookingData = {
      room_id: table.id, // ID стола как ID комнаты
      start_time: new Date().toISOString(),
      end_time: new Date(Date.now() + 3600000).toISOString() // +1 час
    };

    this.http.post('http://127.0.0.1:8000/bookings/', bookingData).subscribe({
      next: () => {
        table.is_occupied = true; // Визуально блокируем стол
        alert(`${table.number} успешно забронирован!`);
      },
      error: (err) => alert('Ошибка бронирования')
    });
  }
}