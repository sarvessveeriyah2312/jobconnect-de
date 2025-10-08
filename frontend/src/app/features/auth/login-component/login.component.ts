import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/rbac.types';

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
        // ✅ Get the role reactively after login
        const role = this.authService.getUserRole()();

        console.log('Logged in role:', role);

        // ✅ Redirect based on role
        switch (role as UserRole) {
          case 'ADMIN':
            this.router.navigate(['/admin']);
            break;
          case 'RECRUITER':
            this.router.navigate(['/recruiter-dashboard']);
            break;
          case 'JOB_APPLICANT':
            this.router.navigate(['/jobs']);
            break;
          default:
            this.router.navigate(['/']);
            break;
        }
      } else {
        this.error.set('Invalid email or password.');
      }
    } catch (err) {
      console.error('Login error:', err);
      this.error.set('An error occurred. Please try again.');
    } finally {
      this.loading.set(false);
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
