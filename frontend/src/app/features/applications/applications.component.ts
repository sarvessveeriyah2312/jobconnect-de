import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          {{ 'applications.title' | translate }}
        </h1>

        @if (applications().length > 0) {
          <div class="space-y-4">
            @for (app of applications(); track app.id) {
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {{ app.jobTitle }}
                    </h3>
                    <p class="text-primary-600 dark:text-primary-400 font-medium mb-3">
                      {{ app.company }}
                    </p>
                    <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>Applied: {{ app.appliedDate }}</span>
                      <span>Resume: {{ app.resumeTitle }}</span>
                    </div>
                  </div>
                  <span
                    class="px-4 py-2 rounded-full text-sm font-medium"
                    [ngClass]="{
                      'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300': app.status === 'pending',
                      'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300': app.status === 'shortlisted',
                      'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300': app.status === 'rejected'
                    }"
                  >
                    {{ 'applications.' + app.status | translate }}
                  </span>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="text-center py-20">
            <svg class="w-24 h-24 mx-auto text-gray-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="text-xl text-gray-600 dark:text-gray-400 mb-6">
              {{ 'applications.noApplications' | translate }}
            </p>
            <a
              routerLink="/jobs"
              class="inline-block px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
            >
              Browse Jobs
            </a>
          </div>
        }
      </div>
    </div>
  `
})
export class ApplicationsComponent {
  applications = signal([
    {
      id: '1',
      jobTitle: 'Senior Full-Stack Developer',
      company: 'TechCorp GmbH',
      status: 'pending',
      appliedDate: '2025-10-01',
      resumeTitle: 'Senior Developer Resume'
    },
    {
      id: '2',
      jobTitle: 'Product Manager',
      company: 'Innovation Labs',
      status: 'shortlisted',
      appliedDate: '2025-09-28',
      resumeTitle: 'Product Manager CV'
    }
  ]);
}
