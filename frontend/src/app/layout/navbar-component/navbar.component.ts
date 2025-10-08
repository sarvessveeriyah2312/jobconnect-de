import { Component, signal, inject, HostListener, ViewChild, ElementRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle.component';
import { LanguageToggleComponent } from '../../shared/components/language-toggle-component/language-toggle.component';
import { AuthService } from '../../core/services/auth.service';
import { SearchService } from '../../core/services/search.service';

interface SearchResult {
  id: string;
  type: 'job' | 'company' | 'skill' | 'profile' | 'application';
  title: string;
  description: string;
  route: string;
  icon: string;
  iconBg: string;
  meta?: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TranslateModule,
    ThemeToggleComponent,
    LanguageToggleComponent
  ],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  isMobileMenuOpen = signal(false);
  isUserMenuOpen = signal(false);
  isSearchOpen = signal(false);
  isSearching = signal(false);
  searchQuery = '';
  activeFilter = 'All';
  
  searchResults = signal<SearchResult[]>([]);
  recentSearches = signal<string[]>([]);
  
  authService = inject(AuthService);
  searchService = inject(SearchService);
  router = inject(Router);

  isAuthenticated = this.authService.getIsAuthenticated();
  currentUser = this.authService.getCurrentUser();
  
  applicationCount = signal(3);

  quickFilters = ['All', 'Jobs', 'Companies', 'Skills', 'Profiles'];
  popularSearches = ['Frontend Developer', 'React', 'Remote', 'Berlin', 'Full Stack', 'JavaScript'];

  constructor() {
    // Load recent searches from localStorage
    this.loadRecentSearches();
    
    // Effect to handle search query changes with debounce
    effect(() => {
      if (this.searchQuery && this.isSearchOpen()) {
        this.debouncedSearch();
      }
    });
  }

  private debounceTimer: any;

  private debouncedSearch() {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.performSearch();
    }, 300);
  }

  openSearch() {
    this.isSearchOpen.set(true);
    setTimeout(() => {
      this.searchInput?.nativeElement?.focus();
    }, 100);
  }

  closeSearch() {
    this.isSearchOpen.set(false);
    this.searchQuery = '';
    this.searchResults.set([]);
  }

  onSearchInput() {
    if (this.searchQuery.trim()) {
      this.isSearching.set(true);
    } else {
      this.searchResults.set([]);
      this.isSearching.set(false);
    }
  }

  async performSearch() {
    if (!this.searchQuery.trim()) {
      this.searchResults.set([]);
      return;
    }

    this.isSearching.set(true);
    
    try {
      // Use the search service to perform global search
      const results = await this.searchService.globalSearch(this.searchQuery, this.activeFilter);
      // this.searchResults.set(this.formatSearchResults(results));
      this.addToRecentSearches(this.searchQuery);
    } catch (error) {
      console.error('Search error:', error);
      this.searchResults.set([]);
    } finally {
      this.isSearching.set(false);
    }
  }

  applyQuickFilter(filter: string) {
    this.activeFilter = filter;
    if (this.searchQuery) {
      this.performSearch();
    }
  }

  searchFromHistory(term: string) {
    this.searchQuery = term;
    this.performSearch();
  }

  navigateToResult(result: SearchResult) {
    this.closeSearch();
    this.router.navigate([result.route]);
  }

  // private formatSearchResults(results: any[]): SearchResult[] {
  //   return results.map(result => {
  //     const baseResult = {
  //       id: result.id,
  //       title: result.title || result.name,
  //       description: result.description || '',
  //       route: this.getRouteForType(result.type, result.id),
  //       ...this.getIconForType(result.type)
  //     };

  //     // Add meta information based on type
  //     if (result.type === 'job') {
  //       return {
  //         ...baseResult,
  //         meta: result.company || result.location
  //       };
  //     } else if (result.type === 'company') {
  //       return {
  //         ...baseResult,
  //         meta: result.industry || `${result.jobCount} jobs`
  //       };
  //     }

  //     return baseResult;
  //   });
  // }

  private getRouteForType(type: string, id: string): string {
    const routes: { [key: string]: string } = {
      job: `/jobs/${id}`,
      company: `/companies/${id}`,
      profile: `/profile/${id}`,
      application: `/applications/${id}`,
      skill: `/jobs?skills=${id}`
    };
    return routes[type] || '/';
  }

  private getIconForType(type: string): { icon: string; iconBg: string } {
    const icons: { [key: string]: { icon: string; iconBg: string } } = {
      job: {
        icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
        iconBg: 'bg-blue-500'
      },
      company: {
        icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
        iconBg: 'bg-green-500'
      },
      profile: {
        icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
        iconBg: 'bg-purple-500'
      },
      application: {
        icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
        iconBg: 'bg-orange-500'
      },
      skill: {
        icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
        iconBg: 'bg-red-500'
      }
    };

    return icons[type] || icons['job'];
  }

  getTypeBadgeClass(type: string): string {
    const classes: { [key: string]: string } = {
      job: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      company: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      profile: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      application: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      skill: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return classes[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }

  private loadRecentSearches() {
    const saved = localStorage.getItem('recent-searches');
    if (saved) {
      this.recentSearches.set(JSON.parse(saved));
    }
  }

  private addToRecentSearches(term: string) {
    const trimmedTerm = term.trim();
    if (!trimmedTerm) return;

    const current = this.recentSearches();
    const updated = [trimmedTerm, ...current.filter(t => t !== trimmedTerm)].slice(0, 5);
    this.recentSearches.set(updated);
    localStorage.setItem('recent-searches', JSON.stringify(updated));
  }

  removeFromHistory(term: string) {
    const updated = this.recentSearches().filter(t => t !== term);
    this.recentSearches.set(updated);
    localStorage.setItem('recent-searches', JSON.stringify(updated));
  }

  // Existing methods remain the same...
  toggleMobileMenu(): void {
    this.isMobileMenuOpen.set(!this.isMobileMenuOpen());
    if (this.isMobileMenuOpen()) {
      this.isUserMenuOpen.set(false);
    }
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen.set(!this.isUserMenuOpen());
    if (this.isUserMenuOpen()) {
      this.isMobileMenuOpen.set(false);
    }
  }

  logout(): void {
    this.authService.logout();
    this.isUserMenuOpen.set(false);
    this.isMobileMenuOpen.set(false);
  }

  getInitials(fullName: string | undefined): string {
    if (!fullName) return 'U';
    return fullName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      this.openSearch();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative.group') && !target.closest('.lg\\:hidden')) {
      this.isUserMenuOpen.set(false);
    }
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (window.innerWidth >= 1024) {
      this.isMobileMenuOpen.set(false);
    }
  }
}