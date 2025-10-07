import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FileUploadComponent } from '../../shared/components/file-upload.component';
import { ResumeService } from '../../core/services/resume.service';

@Component({
  selector: 'app-resume-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, FileUploadComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          {{ 'resume.uploadTitle' | translate }}
        </h1>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
          <form (ngSubmit)="onSubmit()" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ 'resume.title' | translate }}
              </label>
              <input
                type="text"
                [(ngModel)]="resumeTitle"
                name="title"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Senior Developer Resume"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ 'resume.summary' | translate }}
              </label>
              <textarea
                [(ngModel)]="summary"
                name="summary"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="Brief summary of your experience..."
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ 'resume.skills' | translate }}
              </label>
              <input
                type="text"
                [(ngModel)]="skills"
                name="skills"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="JavaScript, TypeScript, Angular, React"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Resume File
              </label>
              <app-file-upload (fileSelected)="onFileSelected($event)" />
            </div>

            @if (uploadSuccess()) {
              <div class="p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg">
                {{ 'resume.success' | translate }}
              </div>
            }

            <button
              type="submit"
              [disabled]="!selectedFile() || !resumeTitle"
              class="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ 'resume.upload' | translate }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `
})
export class ResumeUploadComponent {
  resumeTitle = '';
  summary = '';
  skills = '';
  selectedFile = signal<File | null>(null);
  uploadSuccess = signal(false);

  constructor(
    private resumeService: ResumeService,
    private router: Router
  ) {}

  onFileSelected(file: File) {
    this.selectedFile.set(file);
  }

  onSubmit() {
    if (!this.selectedFile() || !this.resumeTitle) {
      return;
    }

    const skillsArray = this.skills
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    this.resumeService.uploadResume({
      title: this.resumeTitle,
      summary: this.summary,
      skills: skillsArray,
      fileType: this.selectedFile()!.type.includes('pdf') ? 'PDF' : 'DOCX'
    });

    this.uploadSuccess.set(true);

    setTimeout(() => {
      this.router.navigate(['/resumes']);
    }, 2000);
  }
}
