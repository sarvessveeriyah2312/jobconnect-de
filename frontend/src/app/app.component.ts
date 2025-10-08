import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NavbarComponent } from './layout/navbar-component/navbar.component';
import { FooterComponent } from './layout/footer-component/footer.component';
import { SidebarComponent } from './layout/sidebar-component/sidebar.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    TranslateModule,
    NavbarComponent,
    FooterComponent,
    SidebarComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private router = inject(Router);
  authService = inject(AuthService);

  // 🔹 Hide sidebar on login/register/public routes
  shouldShowSidebar(): boolean {
    const currentUrl = this.router.url;
    const publicRoutes = ['/login', '/register', '/']; // add '/' if home shouldn’t show sidebar
    return this.authService.getIsAuthenticated()() && !publicRoutes.includes(currentUrl);
  }
}
