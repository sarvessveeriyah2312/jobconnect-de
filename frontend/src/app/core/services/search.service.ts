import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private http = inject(HttpClient);

  async globalSearch(query: string, filter: string = 'All'): Promise<any[]> {
    // Mock data - replace with actual API calls
    const mockResults = [
      {
        id: '1',
        type: 'job',
        title: 'Senior Frontend Developer',
        description: 'React, TypeScript, Angular - Remote position',
        company: 'Tech Corp',
        location: 'Berlin, Germany',
        skills: ['React', 'TypeScript', 'Angular']
      },
      {
        id: '2',
        type: 'company',
        title: 'Tech Innovations GmbH',
        description: 'Leading tech company specializing in web development',
        industry: 'Technology',
        jobCount: 15
      },
      {
        id: '3',
        type: 'job',
        title: 'Full Stack Engineer',
        description: 'Node.js, React, MongoDB - Hybrid work model',
        company: 'Startup XYZ',
        location: 'Munich, Germany',
        skills: ['Node.js', 'React', 'MongoDB']
      },
      {
        id: '4',
        type: 'skill',
        title: 'React',
        description: 'JavaScript library for building user interfaces'
      },
      {
        id: '5',
        type: 'profile',
        title: 'John Doe',
        description: 'Senior Software Engineer with 5+ years experience'
      }
    ];

    // Filter results based on active filter
    let filteredResults = mockResults;
    if (filter !== 'All') {
      const typeMap: { [key: string]: string } = {
        'Jobs': 'job',
        'Companies': 'company',
        'Skills': 'skill',
        'Profiles': 'profile'
      };
      filteredResults = mockResults.filter(result => result.type === typeMap[filter]);
    }

    // Simple search logic - replace with proper search algorithm
    const searchTerm = query.toLowerCase();
    return filteredResults.filter(result =>
      result.title.toLowerCase().includes(searchTerm) ||
      result.description.toLowerCase().includes(searchTerm) ||
      (result.skills && result.skills.some((skill: string) => skill.toLowerCase().includes(searchTerm)))
    );
  }

  // Method to search jobs specifically
  searchJobs(query: string, filters?: any): Observable<any> {
    // Implement actual API call here
    return of([]);
  }

  // Method to search companies specifically
  searchCompanies(query: string): Observable<any> {
    // Implement actual API call here
    return of([]);
  }

  // Method to get search suggestions
  getSuggestions(query: string): Observable<string[]> {
    // Implement suggestion logic here
    return of([]);
  }
}