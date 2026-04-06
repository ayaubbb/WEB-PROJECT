import { Routes } from '@angular/router';

import { LoginComponent } from './login/login';
import { RoomListComponent } from './room-list/room-list';
import { BookingFormComponent } from './booking-form/booking-form';
import { MyBookingsComponent } from './my-bookings/my-bookings';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'rooms', component: RoomListComponent },
  { path: 'booking', component: BookingFormComponent },
  { path: 'my-bookings', component: MyBookingsComponent }
];