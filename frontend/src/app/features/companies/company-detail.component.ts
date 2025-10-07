import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Company, CompanyService } from '../../core/services/company.service';
import { JobService } from '../../core/services/job.service';
import { JobCardComponent } from '../../shared/components/job-card.component';

@Component({
  selector: 'app-company-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, JobCardComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      @if (company()) {
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 mb-8">
            <div class="flex items-start gap-6 mb-6">
              <img
                [src]="company()!.logo"
                [alt]="company()!.name"
                class="w-24 h-24 rounded-lg object-cover"
              />
              <div class="flex-1">
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {{ company()!.name }}
                </h1>
                <p class="text-lg text-gray-600 dark:text-gray-400 mb-2">
                  {{ company()!.industry }}
                </p>
                <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>{{ company()!.location }}</span>
                  <span>{{ company()!.size }}</span>
                </div>
              </div>
            </div>

            <div class="mb-6">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {{ 'companies.about' | translate }}
              </h2>
              <p class="text-gray-600 dark:text-gray-300">
                {{ company()!.description }}
              </p>
            </div>

            <a
              [href]="company()!.website"
              target="_blank"
              class="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline"
            >
              Visit website
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          <div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {{ 'companies.jobs' | translate }} ({{ companyJobs().length }})
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              @for (job of companyJobs(); track job.id) {
                <app-job-card [job]="job" />
              } @empty {
                <div class="col-span-full text-center py-12 text-gray-600 dark:text-gray-400">
                  No open positions at the moment
                </div>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class CompanyDetailComponent implements OnInit {
  company = signal<Company | undefined>(undefined);
  companyJobs = signal<any[]>([]);

  constructor(
    private route: ActivatedRoute,
    private companyService: CompanyService,
    private jobService: JobService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.company.set(this.companyService.getCompanyById(id));
      this.companyJobs.set(this.jobService.getJobsByCompany(id));
    }
  }
}
