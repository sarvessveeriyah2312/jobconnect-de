import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ResumeService } from '../../core/services/resume.service';
import { ModalComponent } from '../../shared/components/modal.component';

@Component({
  selector: 'app-resumes',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, ModalComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white">
            {{ 'resume.myResumes' | translate }}
          </h1>
          <a
            routerLink="/resume-upload"
            class="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
          >
            + Upload New Resume
          </a>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {{ 'resume.title' | translate }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {{ 'resume.date' | translate }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {{ 'resume.fileType' | translate }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {{ 'resume.actions' | translate }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              @for (resume of resumes(); track resume.id) {
                <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ resume.title }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ resume.summary }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                    {{ resume.uploadDate }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded">
                      {{ resume.fileType }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button
                      (click)="viewResume(resume)"
                      class="text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      {{ 'resume.view' | translate }}
                    </button>
                    <button
                      (click)="deleteResume(resume.id)"
                      class="text-red-600 dark:text-red-400 hover:underline"
                    >
                      {{ 'resume.delete' | translate }}
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="4" class="px-6 py-12 text-center text-gray-600 dark:text-gray-400">
                    No resumes uploaded yet.
                    <a routerLink="/resume-upload" class="text-primary-600 dark:text-primary-400 hover:underline ml-1">
                      Upload your first resume
                    </a>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <app-modal
          [isOpen]="showPreviewModal()"
          [title]="selectedResume()?.title || ''"
          (closeModal)="closePreview()"
        >
          @if (selectedResume()) {
            <div class="space-y-4">
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Summary</h3>
                <p class="text-gray-600 dark:text-gray-300">{{ selectedResume()!.summary }}</p>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Skills</h3>
                <div class="flex flex-wrap gap-2">
                  @for (skill of selectedResume()!.skills; track skill) {
                    <span class="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm">
                      {{ skill }}
                    </span>
                  }
                </div>
              </div>
            </div>
          }

          <div footer>
            <button
              (click)="closePreview()"
              class="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-medium transition-colors"
            >
              {{ 'common.close' | translate }}
            </button>
          </div>
        </app-modal>
      </div>
    </div>
  `
})
export class ResumesComponent {
  resumes = this.resumeService.getResumes();
  showPreviewModal = signal(false);
  selectedResume = signal<any>(null);

  constructor(private resumeService: ResumeService) {}

  viewResume(resume: any) {
    this.selectedResume.set(resume);
    this.showPreviewModal.set(true);
  }

  closePreview() {
    this.showPreviewModal.set(false);
    this.selectedResume.set(null);
  }

  deleteResume(id: string) {
    if (confirm('Are you sure you want to delete this resume?')) {
      this.resumeService.deleteResume(id);
    }
  }
}
