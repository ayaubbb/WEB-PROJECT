import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Room {
  id: number;
  name: string;
  capacity: number;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private baseUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/token/`, credentials);
  }
  
  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.baseUrl}/rooms/`);
  }

  createBooking(data: any) {
    return this.http.post(`${this.baseUrl}/bookings/`, data);
  }

  getUserBookings(): Observable<any> {
    return this.http.get(`${this.baseUrl}/my-bookings/`);
  }

  cancelBooking(id: number) {
    return this.http.delete(`${this.baseUrl}/bookings/${id}/cancel/`);
  }

getCanteenTables() {
  return this.http.get<any[]>(`${this.baseUrl}/api/canteen/tables/`);
}

bookCanteenTable(data: any) {
  return this.http.post(`${this.baseUrl}/api/canteen/book/`, data);
}
}
