import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          {{ 'profile.title' | translate }}
        </h1>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
          <form (ngSubmit)="onSubmit()" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ 'auth.name' | translate }}
              </label>
              <input
                type="text"
                [(ngModel)]="name"
                name="name"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ 'auth.email' | translate }}
              </label>
              <input
                type="email"
                [(ngModel)]="email"
                name="email"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ 'profile.bio' | translate }}
              </label>
              <textarea
                [(ngModel)]="bio"
                name="bio"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ 'resume.skills' | translate }}
              </label>
              <input
                type="text"
                [(ngModel)]="skillsStr"
                name="skills"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="JavaScript, TypeScript, Angular"
              />
            </div>

            @if (saveSuccess()) {
              <div class="p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg">
                {{ 'profile.changesSaved' | translate }}
              </div>
            }

            <button
              type="submit"
              class="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
            >
              {{ 'profile.saveChanges' | translate }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent {
  currentUser = this.authService.getCurrentUser();

  name = this.currentUser()?.name || '';
  email = this.currentUser()?.email || '';
  bio = this.currentUser()?.bio || '';
  skillsStr = this.currentUser()?.skills?.join(', ') || '';

  saveSuccess = signal(false);

  constructor(private authService: AuthService) {}

  onSubmit() {
    const skills = this.skillsStr
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    this.authService.updateProfile({
      name: this.name,
      email: this.email,
      bio: this.bio,
      skills
    });

    this.saveSuccess.set(true);
    setTimeout(() => this.saveSuccess.set(false), 3000);
  }
}
