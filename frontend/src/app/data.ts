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
  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api/rooms/';

  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(this.apiUrl);
  }
}
