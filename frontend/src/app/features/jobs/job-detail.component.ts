import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Job, JobService } from '../../core/services/job.service';
import { ResumeService } from '../../core/services/resume.service';
import { AuthService } from '../../core/services/auth.service';
import { ModalComponent } from '../../shared/components/modal.component';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TranslateModule, ModalComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      @if (job()) {
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
            <div class="flex justify-between items-start mb-6">
              <div>
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {{ job()!.title }}
                </h1>
                <p class="text-xl text-primary-600 dark:text-primary-400 font-medium">
                  {{ job()!.company }}
                </p>
              </div>
              <span class="px-4 py-2 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full font-medium">
                {{ job()!.type }}
              </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span>{{ job()!.location }}</span>
              </div>
              <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ job()!.salary }}</span>
              </div>
            </div>

            <div class="mb-8">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {{ 'jobs.description' | translate }}
              </h2>
              <p class="text-gray-600 dark:text-gray-300">
                {{ job()!.description }}
              </p>
            </div>

            <div class="mb-8">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {{ 'jobs.requirements' | translate }}
              </h2>
              <ul class="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                @for (req of job()!.requirements; track req) {
                  <li>{{ req }}</li>
                }
              </ul>
            </div>

            <button
              (click)="openApplyModal()"
              class="w-full md:w-auto px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
            >
              {{ 'jobs.apply' | translate }}
            </button>
          </div>
        </div>

        <app-modal
          [isOpen]="showApplyModal()"
          [title]="'jobs.applyForJob' | translate"
          (closeModal)="closeApplyModal()"
        >
          <div class="space-y-4">
            <p class="text-gray-600 dark:text-gray-300">
              Select a resume to apply for this position:
            </p>
            <select
              [(ngModel)]="selectedResumeId"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ 'common.selectResume' | translate }}</option>
              @for (resume of resumes(); track resume.id) {
                <option [value]="resume.id">{{ resume.title }}</option>
              }
            </select>
          </div>

          <div footer class="flex gap-2">
            <button
              (click)="submitApplication()"
              [disabled]="!selectedResumeId"
              class="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ 'common.submit' | translate }}
            </button>
            <button
              (click)="closeApplyModal()"
              class="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-medium transition-colors"
            >
              {{ 'common.cancel' | translate }}
            </button>
          </div>
        </app-modal>
      } @else {
        <div class="text-center py-12">
          <p class="text-gray-600 dark:text-gray-400">Job not found</p>
        </div>
      }
    </div>
  `
})
export class JobDetailComponent implements OnInit {
  job = signal<Job | undefined>(undefined);
  resumes = this.resumeService.getResumes();
  showApplyModal = signal(false);
  selectedResumeId = '';

  constructor(
    private route: ActivatedRoute,
    private jobService: JobService,
    private resumeService: ResumeService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.job.set(this.jobService.getJobById(id));
    }
  }

  openApplyModal() {
    const isAuth = this.authService.getIsAuthenticated()();
    if (!isAuth) {
      alert('Please login to apply for jobs');
      return;
    }
    this.showApplyModal.set(true);
  }

  closeApplyModal() {
    this.showApplyModal.set(false);
    this.selectedResumeId = '';
  }

  submitApplication() {
    if (this.selectedResumeId) {
      alert('Application submitted successfully!');
      this.closeApplyModal();
    }
  }
}
