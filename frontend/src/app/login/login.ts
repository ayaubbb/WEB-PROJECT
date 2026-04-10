import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  credentials = { username: '', password: '' };

  constructor(
    private dataService: DataService, 
    private router: Router
  ) {}

  onLogin() {
    this.dataService.login(this.credentials).subscribe({
      next: (response: any) => {
        localStorage.setItem('token', response.access); 
        this.router.navigate(['/rooms']); 
        
        console.log('Мы вошли!');
      },
      error: (err) => {
        console.error('Ошибка входа', err);
      }
    });
  }
}
