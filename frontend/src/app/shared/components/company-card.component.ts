import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Company } from '../../core/services/company.service';

@Component({
  selector: 'app-company-card',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  template: `
    <a
      [routerLink]="['/companies', company.id]"
      class="block bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-200 dark:border-gray-700 hover:scale-105 transform"
    >
      <div class="flex items-start gap-4 mb-4">
        <img
          [src]="company.logo"
          [alt]="company.name"
          class="w-16 h-16 rounded-lg object-cover"
        />
        <div class="flex-1">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-1">
            {{ company.name }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ company.industry }}
          </p>
        </div>
      </div>

      <p class="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
        {{ company.description }}
      </p>

      <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <span class="text-sm">{{ company.location }}</span>
        </div>
        <span class="px-3 py-1 bg-accent-100 dark:bg-accent-900 text-accent-700 dark:text-accent-300 rounded-full text-sm font-medium">
          {{ company.openPositions }} {{ 'companies.openPositions' | translate }}
        </span>
      </div>
    </a>
  `
})
export class CompanyCardComponent {
  @Input({ required: true }) company!: Company;
}
