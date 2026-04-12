<<<<<<< HEAD
import { Routes } from '@angular/router';
// Импортируем твои созданные компоненты
import { CanteenComponent } from './components/canteen/canteen.component';
import { MyBookingsComponent } from './components/my-bookings/my-bookings.component';

export const routes: Routes = [
  {
    path: 'canteen',
    component: CanteenComponent,
    title: 'Столовая' // Заголовок вкладки в браузере
  },
  {
    path: 'my-bookings',
    component: MyBookingsComponent,
    title: 'Мои бронирования'
  },
  // Можно добавить пустой путь, чтобы по умолчанию открывалась столовая
  {
    path: '',
    redirectTo: '/canteen',
    pathMatch: 'full'
  }
];
=======
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { LoginComponent } from './login/login';
import { RoomListComponent } from './room-list/room-list';
import { BookingFormComponent } from './booking-form/booking-form';
import { MyBookingsComponent } from './my-bookings/my-bookings';
import { CanteenComponent } from './canteen/canteen';
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  
  if (token) {
    return true; // Пускаем
  } else {
    router.navigate(['/login']); // Выгоняем
    return false;
  }
};

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'rooms', component: RoomListComponent, canActivate: [authGuard] },
  { path: 'bookings', component: BookingFormComponent, canActivate: [authGuard] },
  { path: 'canteen', component: CanteenComponent, canActivate: [authGuard] },
  { path: 'my-bookings', component: MyBookingsComponent, canActivate: [authGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
>>>>>>> 6b9d888d75be2ba1cfbcf7b7ff6a1b7d1f556416
