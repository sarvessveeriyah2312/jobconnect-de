import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { JobService } from '../../core/services/job.service';
import { JobCardComponent } from '../../shared/components/job-card.component';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, JobCardComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          {{ 'jobs.title' | translate }}
        </h1>

        <div class="mb-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ 'jobs.filters' | translate }}
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ 'jobs.location' | translate }}
              </label>
              <input
                type="text"
                [(ngModel)]="locationFilter"
                placeholder="Berlin, Munich..."
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ 'jobs.category' | translate }}
              </label>
              <select
                [(ngModel)]="categoryFilter"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Categories</option>
                <option value="Engineering">Engineering</option>
                <option value="Product">Product</option>
                <option value="Design">Design</option>
                <option value="Data Science">Data Science</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ 'jobs.type' | translate }}
              </label>
              <select
                [(ngModel)]="typeFilter"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (job of filteredJobs(); track job.id) {
            <app-job-card [job]="job" />
          } @empty {
            <div class="col-span-full text-center py-12 text-gray-600 dark:text-gray-400">
              No jobs found matching your filters
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class JobsComponent {
  jobs = this.jobService.getJobs();

  locationFilter = '';
  categoryFilter = '';
  typeFilter = '';

  filteredJobs = signal(this.jobs());

  constructor(private jobService: JobService) {
    this.updateFilters();
  }

  updateFilters() {
    this.filteredJobs.set(
      this.jobService.filterJobs({
        location: this.locationFilter,
        category: this.categoryFilter,
        type: this.typeFilter
      })
    );
  }

  ngDoCheck() {
    this.updateFilters();
  }
}
