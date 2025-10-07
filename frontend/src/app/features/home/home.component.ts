import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { JobService } from '../../core/services/job.service';
import { CompanyService } from '../../core/services/company.service';
import { JobCardComponent } from '../../shared/components/job-card.component';
import { CompanyCardComponent } from '../../shared/components/company-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    JobCardComponent,
    CompanyCardComponent
  ],
  template: `
    <div class="min-h-screen">
      <section class="bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-800 dark:to-primary-950 text-white py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 class="text-5xl font-bold mb-6 animate-fade-in">
            {{ 'home.heroTitle' | translate }}
          </h1>
          <p class="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
            {{ 'home.heroSubtitle' | translate }}
          </p>
          <a
            routerLink="/jobs"
            class="inline-block px-8 py-4 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            {{ 'home.exploreJobs' | translate }}
          </a>
        </div>
      </section>

      <section class="py-16 bg-gray-50 dark:bg-gray-900">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            {{ 'home.featuredJobs' | translate }}
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (job of featuredJobs(); track job.id) {
              <app-job-card [job]="job" />
            }
          </div>
          <div class="text-center mt-8">
            <a
              routerLink="/jobs"
              class="text-primary-600 dark:text-primary-400 hover:underline font-medium"
            >
              View all jobs →
            </a>
          </div>
        </div>
      </section>

      <section class="py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            {{ 'home.topCompanies' | translate }}
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (company of topCompanies(); track company.id) {
              <app-company-card [company]="company" />
            }
          </div>
        </div>
      </section>
    </div>
  `
})
export class HomeComponent {
  jobs = this.jobService.getJobs();
  companies = this.companyService.getCompanies();

  featuredJobs = computed(() => this.jobs().slice(0, 3));
  topCompanies = computed(() => this.companies().slice(0, 3));

  constructor(
    private jobService: JobService,
    private companyService: CompanyService
  ) {}
}
