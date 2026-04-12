import { Component, OnInit, inject} from '@angular/core';
import { DataService } from '../data';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.css',
})
export class MyBookingsComponent implements OnInit {
  private dataService = inject(DataService);
  bookings: any[] = [];
  errorMessage = '';

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.dataService.getUserBookings().subscribe({
      next: (data) => {
        this.bookings = data;
      },
      error: (err) => {
        this.errorMessage = 'Could not load bookings';
        console.error(err);
      }
    });
  }

  deleteBooking(id: number) {
    if (confirm('Are you sure you want to cancel the booking?')) {
      this.dataService.cancelBooking(id).subscribe({
        next: () => {
          
          this.bookings = this.bookings.filter(b => b.id !== id);
        },
        error: (err) => {
          alert('Error occurred while canceling the booking');
        }
      });
    }
  }
}
