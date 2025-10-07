import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle.component';
import { LanguageToggleComponent } from '../../shared/components/language-toggle-component/language-toggle.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    ThemeToggleComponent,
    LanguageToggleComponent
  ],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  isMobileMenuOpen = false;

  constructor(public authService: AuthService) {}

  isAuthenticated = this.authService.getIsAuthenticated();
  currentUser = this.authService.getCurrentUser();
}
