import { Component, OnInit, inject } from '@angular/core';
import { DataService, Room } from '../data';

@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [],
  templateUrl: './room-list.html',
  styleUrl: './room-list.css'
})
export class RoomListComponent implements OnInit {
  private dataService = inject(DataService);

  rooms: Room[] = [];
  errorMessage = '';

  ngOnInit(): void {
    this.dataService.getRooms().subscribe({
      next: (data) => {
        this.rooms = data;
      },
      error: (error) => {
        console.error('Error loading rooms:', error);
        this.errorMessage = 'Failed to load rooms';
      }
    });
  }
}
