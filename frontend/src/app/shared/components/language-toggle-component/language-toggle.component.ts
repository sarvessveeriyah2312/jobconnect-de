import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-language-toggle',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './language-toggle.component.html',
  styleUrls: ['./language-toggle.component.css'] // optional
})
export class LanguageToggleComponent {
  constructor(public languageService: LanguageService) {}

  flagEmoji = computed(() =>
    this.languageService.langSignal() === 'en' ? '🇬🇧' : '🇩🇪'
  );

  langCode = computed(() =>
    this.languageService.langSignal().toUpperCase()
  );
}
