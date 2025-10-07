import { Injectable, signal } from '@angular/core';

export interface Candidate {
  id: string;
  name: string;
  score: number;
  resumeId: string;
  matchFactors: string[];
}

export interface JobMatch {
  jobId: string;
  candidates: Candidate[];
}

@Injectable({
  providedIn: 'root'
})
export class MatchingService {
  private matches = signal<JobMatch[]>([]);
  private loading = signal<boolean>(false);

  constructor() {
    this.loadMatches();
  }

  private async loadMatches() {
    this.loading.set(true);
    try {
      const response = await fetch('/assets/data/matches.json');
      const data = await response.json();
      this.matches.set(data);
    } catch (error) {
      console.error('Failed to load matches:', error);
    } finally {
      this.loading.set(false);
    }
  }

  getCandidatesForJob(jobId: string): Candidate[] {
    const match = this.matches().find(m => m.jobId === jobId);
    return match?.candidates || [];
  }

  getAIInsights(jobId: string): string {
    const candidates = this.getCandidatesForJob(jobId);
    const avgScore = candidates.reduce((sum, c) => sum + c.score, 0) / (candidates.length || 1);

    return `Based on AI analysis, this job has ${candidates.length} matching candidates with an average match score of ${avgScore.toFixed(1)}%.
    Top candidates demonstrate strong alignment with required skills and experience.
    Consider prioritizing candidates with scores above 85% for initial interviews.`;
  }

  isLoading() {
    return this.loading.asReadonly();
  }
}
