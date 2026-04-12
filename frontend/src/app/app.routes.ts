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