import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { LoginComponent } from './login/login';
import { RoomListComponent } from './room-list/room-list';
import { BookingFormComponent } from './booking-form/booking-form';
import { MyBookingsComponent } from './my-bookings/my-bookings';
import { CanteenComponent } from './canteen/canteen';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'rooms', component: RoomListComponent },
  { path: 'bookings', component: BookingFormComponent },
  { path: 'canteen', component: CanteenComponent },
  { path: 'my-bookings', component: MyBookingsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }