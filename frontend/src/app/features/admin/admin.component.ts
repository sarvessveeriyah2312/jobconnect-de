import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { JobService } from '../../core/services/job.service';
import { CompanyService } from '../../core/services/company.service';
import { ResumeService } from '../../core/services/resume.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          {{ 'admin.title' | translate }}
        </h1>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 dark:text-gray-400 text-sm mb-1">Total Jobs</p>
                <p class="text-3xl font-bold text-gray-900 dark:text-white">
                  {{ jobs().length }}
                </p>
              </div>
              <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 dark:text-gray-400 text-sm mb-1">Total Companies</p>
                <p class="text-3xl font-bold text-gray-900 dark:text-white">
                  {{ companies().length }}
                </p>
              </div>
              <div class="w-12 h-12 bg-accent-100 dark:bg-accent-900 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-accent-600 dark:text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 dark:text-gray-400 text-sm mb-1">Total Resumes</p>
                <p class="text-3xl font-bold text-gray-900 dark:text-white">
                  {{ resumes().length }}
                </p>
              </div>
              <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {{ 'admin.jobs' | translate }}
            </h2>
            <div class="space-y-3">
              @for (job of jobs().slice(0, 5); track job.id) {
                <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">{{ job.title }}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ job.company }}</p>
                  </div>
                  <span class="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded">
                    {{ job.type }}
                  </span>
                </div>
              }
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {{ 'admin.companies' | translate }}
            </h2>
            <div class="space-y-3">
              @for (company of companies().slice(0, 5); track company.id) {
                <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">{{ company.name }}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ company.location }}</p>
                  </div>
                  <span class="text-xs px-2 py-1 bg-accent-100 dark:bg-accent-900 text-accent-700 dark:text-accent-300 rounded">
                    {{ company.openPositions }} jobs
                  </span>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminComponent {
  jobs = this.jobService.getJobs();
  companies = this.companyService.getCompanies();
  resumes = this.resumeService.getResumes();

  constructor(
    private jobService: JobService,
    private companyService: CompanyService,
    private resumeService: ResumeService
  ) {}
}
