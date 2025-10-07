import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email = '';
  password = '';
  showPassword = false;
  loading = signal(false);
  error = signal('');

  private router = inject(Router);
  private authService = inject(AuthService);

  async onSubmit() {
    if (!this.email || !this.password) {
      this.error.set('Please fill in all fields.');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    try {
      const success = await this.authService.login(this.email, this.password);
      if (success) {
        this.router.navigate(['/']);
      } else {
        this.error.set('Invalid email or password.');
      }
    } catch (err) {
      this.error.set('An error occurred. Please try again.');
    } finally {
      this.loading.set(false);
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
