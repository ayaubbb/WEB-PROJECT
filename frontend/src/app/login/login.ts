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
  isLoading = false;
  errorMessage = '';

  credentials = { username: '', password: '' };

  constructor(
    private dataService: DataService, 
    private router: Router
  ) {}

  onLogin() {
    this.isLoading = true;
    this.errorMessage = '';

    this.dataService.login(this.credentials).subscribe({
      next: (response: any) => {
        localStorage.setItem('token', response.access); 
        this.router.navigate(['/rooms']); 
        
        console.log('Successfully logged in');
      },
      error: (err) => {
        console.error('Login error', err);
        this.errorMessage = 'Invalid username or password';
      }
    });
  }
}
