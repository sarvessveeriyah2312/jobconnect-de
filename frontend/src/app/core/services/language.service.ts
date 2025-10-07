import { Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  // 👇 Reactive signal
  private currentLang = signal<'en' | 'de'>('en');

  constructor(private translate: TranslateService) {
    const savedLang = (localStorage.getItem('language') as 'en' | 'de') || 'en';
    this.setLanguage(savedLang);

    // ✅ Keep TranslateService and signal in sync
    this.translate.onLangChange.subscribe(event => {
      this.currentLang.set(event.lang as 'en' | 'de');
    });
  }

  /** Get current language reactively */
  getCurrentLanguage(): 'en' | 'de' {
    return this.currentLang();
  }

  /** Expose readonly signal for computed() tracking */
  langSignal = this.currentLang.asReadonly();

  /** Change language and persist */
  setLanguage(lang: 'en' | 'de') {
    this.currentLang.set(lang);
    this.translate.use(lang);
    localStorage.setItem('language', lang);
  }

  /** Toggle between English and German */
  toggleLanguage() {
    const newLang = this.currentLang() === 'en' ? 'de' : 'en';
    this.setLanguage(newLang);
  }
}
