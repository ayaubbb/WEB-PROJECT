import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

// alua
import { CanteenComponent } from './components/canteen/canteen.component';
import { MyBookingsComponent } from './components/my-bookings/my-bookings.component';

import { LoginComponent } from './login/login';
import { RoomListComponent } from './room-list/room-list';
import { BookingFormComponent } from './booking-form/booking-form';

const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  return token ? true : router.navigate(['/login']);
};

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'rooms', component: RoomListComponent, canActivate: [authGuard] },
  { path: 'bookings', component: BookingFormComponent, canActivate: [authGuard] },
  // alua
  { path: 'canteen', component: CanteenComponent, canActivate: [authGuard], title: 'Canteen' },
  { path: 'my-bookings', component: MyBookingsComponent, canActivate: [authGuard], title: 'My Bookings' }
];