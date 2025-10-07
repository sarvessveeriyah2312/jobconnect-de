import { Injectable, signal } from '@angular/core';

export interface Company {
  id: string;
  name: string;
  logo: string;
  description: string;
  location: string;
  industry: string;
  size: string;
  website: string;
  openPositions: number;
}

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private companies = signal<Company[]>([]);
  private loading = signal<boolean>(false);

  constructor() {
    this.loadCompanies();
  }

  private async loadCompanies() {
    this.loading.set(true);
    try {
      const response = await fetch('/assets/data/companies.json');
      const data = await response.json();
      this.companies.set(data);
    } catch (error) {
      console.error('Failed to load companies:', error);
    } finally {
      this.loading.set(false);
    }
  }

  getCompanies() {
    return this.companies.asReadonly();
  }

  getCompanyById(id: string): Company | undefined {
    return this.companies().find(company => company.id === id);
  }

  isLoading() {
    return this.loading.asReadonly();
  }
}
