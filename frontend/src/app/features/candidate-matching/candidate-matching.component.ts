import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { JobService } from '../../core/services/job.service';
import { MatchingService, Candidate } from '../../core/services/matching.service';

@Component({
  selector: 'app-candidate-matching',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          {{ 'matching.title' | translate }}
        </h1>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ 'matching.selectJob' | translate }}
          </label>
          <select
            [(ngModel)]="selectedJobId"
            (change)="loadCandidates()"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select a job...</option>
            @for (job of jobs(); track job.id) {
              <option [value]="job.id">{{ job.title }} - {{ job.company }}</option>
            }
          </select>
        </div>

        @if (selectedJobId && candidates().length > 0) {
          <div class="bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 mb-8 border border-primary-200 dark:border-gray-700">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              {{ 'matching.aiInsights' | translate }}
            </h2>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
              {{ aiInsights() }}
            </p>
          </div>

          <div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {{ 'matching.results' | translate }} ({{ candidates().length }})
            </h2>

            <div class="space-y-4">
              @for (candidate of candidates(); track candidate.id) {
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div class="flex items-start justify-between mb-4">
                    <div>
                      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                        {{ candidate.name }}
                      </h3>
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        Resume ID: {{ candidate.resumeId }}
                      </p>
                    </div>
                    <div class="text-right">
                      <div class="text-3xl font-bold" [class]="getScoreColor(candidate.score)">
                        {{ candidate.score }}%
                      </div>
                      <p class="text-xs text-gray-600 dark:text-gray-400">
                        {{ 'matching.score' | translate }}
                      </p>
                    </div>
                  </div>

                  <div class="mb-4">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Match Score</span>
                      <span class="text-sm font-medium" [class]="getScoreColor(candidate.score)">
                        {{ candidate.score }}%
                      </span>
                    </div>
                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div
                        class="h-full rounded-full transition-all duration-1000 ease-out"
                        [style.width.%]="candidate.score"
                        [ngClass]="{
                          'bg-green-500': candidate.score >= 85,
                          'bg-yellow-500': candidate.score >= 70 && candidate.score < 85,
                          'bg-orange-500': candidate.score < 70
                        }"
                      ></div>
                    </div>
                  </div>

                  <div class="mb-4">
                    <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Match Factors:
                    </h4>
                    <ul class="space-y-1">
                      @for (factor of candidate.matchFactors; track factor) {
                        <li class="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <svg class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{{ factor }}</span>
                        </li>
                      }
                    </ul>
                  </div>

                  <button
                    class="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
                  >
                    {{ 'matching.viewResume' | translate }}
                  </button>
                </div>
              }
            </div>
          </div>
        } @else if (selectedJobId) {
          <div class="text-center py-12 text-gray-600 dark:text-gray-400">
            No matching candidates found for this job
          </div>
        }
      </div>
    </div>
  `
})
export class CandidateMatchingComponent {
  jobs = this.jobService.getJobs();
  selectedJobId = '';
  candidates = signal<Candidate[]>([]);
  aiInsights = signal('');

  constructor(
    private jobService: JobService,
    private matchingService: MatchingService
  ) {}

  loadCandidates() {
    if (this.selectedJobId) {
      this.candidates.set(this.matchingService.getCandidatesForJob(this.selectedJobId));
      this.aiInsights.set(this.matchingService.getAIInsights(this.selectedJobId));
    }
  }

  getScoreColor(score: number): string {
    if (score >= 85) return 'text-green-600 dark:text-green-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-orange-600 dark:text-orange-400';
  }
}
