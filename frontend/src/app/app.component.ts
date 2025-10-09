import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NavbarComponent } from './layout/navbar-component/navbar.component';
import { FooterComponent } from './layout/footer-component/footer.component';
import { SidebarComponent } from './layout/sidebar-component/sidebar.component';
import { AuthService } from './core/services/auth.service';
import { SidebarService } from './core/services/sidebar.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TranslateModule, NavbarComponent, FooterComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  authService = inject(AuthService);
  sidebarService = inject(SidebarService);
}
