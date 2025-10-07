import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Job } from '../../core/services/job.service';

@Component({
  selector: 'app-job-card',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 border border-gray-200 dark:border-gray-700">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {{ job.title }}
          </h3>
          <p class="text-primary-600 dark:text-primary-400 font-medium">
            {{ job.company }}
          </p>
        </div>
        <span class="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium">
          {{ job.type }}
        </span>
      </div>

      <div class="space-y-2 mb-4">
        <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span class="text-sm">{{ job.location }}</span>
        </div>
        <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-sm">{{ job.salary }}</span>
        </div>
      </div>

      <p class="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
        {{ job.description }}
      </p>

      <div class="flex items-center justify-between">
        <span class="text-xs text-gray-500 dark:text-gray-400">
          {{ job.posted }}
        </span>
        <a
          [routerLink]="['/jobs', job.id]"
          class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
        >
          {{ 'jobs.apply' | translate }}
        </a>
      </div>
    </div>
  `
})
export class JobCardComponent {
  @Input({ required: true }) job!: Job;
}
