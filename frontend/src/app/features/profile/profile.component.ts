import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  currentUser = this.authService.getCurrentUser();

  name = this.currentUser()?.fullName || '';
  email = this.currentUser()?.email || '';
  // bio = this.currentUser()?.bio || '';
  // skillsStr = this.currentUser()?.skills?.join(', ') || '';

  saveSuccess = signal(false);

  constructor(private authService: AuthService) {}

  onSubmit() {
    // const skills = this.skillsStr
    //   .split(',')
    //   .map((s: string) => s.trim())
    //   .filter((s: string | any[]) => s.length > 0);

    this.authService.updateProfile({
      fullName: this.name,
      email: this.email,
      // bio: this.bio,
      // skills
    });

    this.saveSuccess.set(true);
    setTimeout(() => this.saveSuccess.set(false), 3000);
  }
}
