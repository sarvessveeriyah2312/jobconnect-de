import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeToggleComponent } from '../shared/components/theme-toggle.component';
import { LanguageToggleComponent } from '../shared/components/language-toggle.component';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    ThemeToggleComponent,
    LanguageToggleComponent
  ],
  template: `
    <nav class="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center gap-8">
            <a routerLink="/" class="flex items-center gap-2">
              <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-xl">JC</span>
              </div>
              <span class="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 bg-clip-text text-transparent">
                Job Connect-DE
              </span>
            </a>

            <div class="hidden md:flex items-center gap-6">
              <a
                routerLink="/"
                routerLinkActive="text-primary-600 dark:text-primary-400"
                [routerLinkActiveOptions]="{exact: true}"
                class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
              >
                {{ 'navbar.home' | translate }}
              </a>
              <a
                routerLink="/jobs"
                routerLinkActive="text-primary-600 dark:text-primary-400"
                class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
              >
                {{ 'navbar.jobs' | translate }}
              </a>
              <a
                routerLink="/companies"
                routerLinkActive="text-primary-600 dark:text-primary-400"
                class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
              >
                {{ 'navbar.companies' | translate }}
              </a>

              @if (isAuthenticated()) {
                <a
                  routerLink="/applications"
                  routerLinkActive="text-primary-600 dark:text-primary-400"
                  class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
                >
                  {{ 'navbar.applications' | translate }}
                </a>
                <a
                  routerLink="/resumes"
                  routerLinkActive="text-primary-600 dark:text-primary-400"
                  class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
                >
                  {{ 'navbar.resumes' | translate }}
                </a>
                <a
                  routerLink="/profile"
                  routerLinkActive="text-primary-600 dark:text-primary-400"
                  class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
                >
                  {{ 'navbar.profile' | translate }}
                </a>
                <a
                  routerLink="/admin"
                  routerLinkActive="text-primary-600 dark:text-primary-400"
                  class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
                >
                  {{ 'navbar.admin' | translate }}
                </a>
              }
            </div>
          </div>

          <div class="flex items-center gap-4">
            <app-language-toggle />
            <app-theme-toggle />

            @if (isAuthenticated()) {
              <div class="flex items-center gap-3">
                <span class="text-sm text-gray-700 dark:text-gray-300 hidden md:block">
                  {{ currentUser()?.name }}
                </span>
                <button
                  (click)="authService.logout()"
                  class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            } @else {
              <div class="flex items-center gap-3">
                <a
                  routerLink="/login"
                  class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  {{ 'navbar.login' | translate }}
                </a>
                <a
                  routerLink="/register"
                  class="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
                >
                  {{ 'navbar.register' | translate }}
                </a>
              </div>
            }
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  isAuthenticated = this.authService.getIsAuthenticated();
  currentUser = this.authService.getCurrentUser();

  constructor(public authService: AuthService) {}
}
