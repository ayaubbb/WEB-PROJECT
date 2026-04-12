import { Component, OnInit, inject } from '@angular/core';
import { DataService } from '../data'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-canteen',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './canteen.html',
  styleUrl: './canteen.css'
})

export class CanteenComponent implements OnInit {
  private dataService = inject(DataService);
  
  tables: any[] = [];
  message = '';

  ngOnInit() {
    this.loadTables();
  }

  loadTables() {
    this.dataService.getCanteenTables().subscribe({
      next: (data) => this.tables = data,
      error: () => this.message = 'Failed to load tables'
    });
  }

  bookTable(tableId: number) {
    this.dataService.bookCanteenTable({ table_id: tableId }).subscribe({
      next: () => alert('Table booked successfully!'),
      error: () => alert('Failed to book table')
    });
  }
}
