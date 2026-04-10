import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../data';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './booking-form.html',
  styleUrl: './booking-form.css'
})
export class BookingFormComponent {
  private dataService = inject(DataService);

  roomId = 1;
  startTime = '';
  endTime = '';
  message = '';

  book() {
    const bookingData = {
      room_id: this.roomId,
      start_time: this.startTime,
      end_time: this.endTime
    };

    this.dataService.createBooking(bookingData).subscribe({
      next: () => {
        this.message = 'Booking successful!';
      },
      error: (err) => {
        console.error(err);
        this.message = 'Error creating booking';
      }
    });
  }
}
