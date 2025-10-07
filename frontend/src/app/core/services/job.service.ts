import { Injectable, signal } from '@angular/core';

export interface Job {
  id: string;
  title: string;
  company: string;
  companyId: string;
  location: string;
  type: string;
  category: string;
  description: string;
  requirements: string[];
  salary: string;
  posted: string;
}

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private jobs = signal<Job[]>([]);
  private loading = signal<boolean>(false);

  constructor() {
    this.loadJobs();
  }

  private async loadJobs() {
    this.loading.set(true);
    try {
      const response = await fetch('/assets/data/jobs.json');
      const data = await response.json();
      this.jobs.set(data);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      this.loading.set(false);
    }
  }

  getJobs() {
    return this.jobs.asReadonly();
  }

  getJobById(id: string): Job | undefined {
    return this.jobs().find(job => job.id === id);
  }

  getJobsByCompany(companyId: string): Job[] {
    return this.jobs().filter(job => job.companyId === companyId);
  }

  filterJobs(filters: { location?: string; category?: string; type?: string }): Job[] {
    return this.jobs().filter(job => {
      if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      if (filters.category && job.category !== filters.category) {
        return false;
      }
      if (filters.type && job.type !== filters.type) {
        return false;
      }
      return true;
    });
  }

  isLoading() {
    return this.loading.asReadonly();
  }
}
