import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CompanyService } from '../../core/services/company.service';
import { CompanyCardComponent } from '../../shared/components/company-card.component';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [CommonModule, TranslateModule, CompanyCardComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          {{ 'companies.title' | translate }}
        </h1>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (company of companies(); track company.id) {
            <app-company-card [company]="company" />
          }
        </div>
      </div>
    </div>
  `
})
export class CompaniesComponent {
  companies = this.companyService.getCompanies();

  constructor(private companyService: CompanyService) {}
}
