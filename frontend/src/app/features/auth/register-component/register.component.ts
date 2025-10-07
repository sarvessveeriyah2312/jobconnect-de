import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  step = signal(1);
  totalSteps = 3;

  // Form fields
  firstName = '';
  lastName = '';
  email = '';
  country = '';
  state = '';
  phone = '';
  password = '';
  confirmPassword = '';

  loading = signal(false);
  error = signal('');

  constructor(private authService: AuthService, private router: Router) {}

  nextStep() {
    if (this.step() < this.totalSteps) this.step.update(s => s + 1);
  }

  prevStep() {
    if (this.step() > 1) this.step.update(s => s - 1);
  }

  async onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.error.set('Passwords do not match.');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    try {
      const success = await this.authService.register(
        `${this.firstName} ${this.lastName}`,
        this.email,
        this.password
      );
      if (success) {
        this.router.navigate(['/profile']);
      }
    } catch {
      this.error.set('An error occurred. Please try again.');
    } finally {
      this.loading.set(false);
    }
  }
}
