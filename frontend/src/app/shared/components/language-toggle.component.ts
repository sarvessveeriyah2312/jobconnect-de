import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../core/services/language.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-language-toggle',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <button
      (click)="languageService.toggleLanguage()"
      class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
    >
      <span class="text-xl">{{ flagEmoji() }}</span>
      <span class="text-sm font-medium">{{ langCode() }}</span>
    </button>
  `
})
export class LanguageToggleComponent {
  constructor(public languageService: LanguageService) {}

  flagEmoji = computed(() => {
    return this.languageService.getCurrentLanguage() === 'en' ? '🇬🇧' : '🇩🇪';
  });

  langCode = computed(() => {
    return this.languageService.getCurrentLanguage().toUpperCase();
  });
}
