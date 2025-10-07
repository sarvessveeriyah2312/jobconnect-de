import { Injectable, signal } from '@angular/core';

export interface Resume {
  id: string;
  title: string;
  uploadDate: string;
  fileType: string;
  summary: string;
  skills: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ResumeService {
  private resumes = signal<Resume[]>([]);
  private loading = signal<boolean>(false);

  constructor() {
    this.loadResumes();
  }

  private async loadResumes() {
    this.loading.set(true);
    try {
      const response = await fetch('/assets/data/resumes.json');
      const data = await response.json();
      this.resumes.set(data);
    } catch (error) {
      console.error('Failed to load resumes:', error);
    } finally {
      this.loading.set(false);
    }
  }

  getResumes() {
    return this.resumes.asReadonly();
  }

  getResumeById(id: string): Resume | undefined {
    return this.resumes().find(resume => resume.id === id);
  }

  uploadResume(resume: Omit<Resume, 'id' | 'uploadDate'>): Resume {
    const newResume: Resume = {
      ...resume,
      id: Date.now().toString(),
      uploadDate: new Date().toISOString().split('T')[0]
    };

    this.resumes.update(resumes => [...resumes, newResume]);
    return newResume;
  }

  deleteResume(id: string) {
    this.resumes.update(resumes => resumes.filter(r => r.id !== id));
  }

  isLoading() {
    return this.loading.asReadonly();
  }
}
