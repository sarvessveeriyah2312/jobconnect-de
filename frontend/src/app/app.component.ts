import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NavbarComponent } from './layout/navbar-component/navbar.component';
import { FooterComponent } from './layout/footer-component/footer.component';
import { SidebarComponent } from './layout/sidebar-component/sidebar.component';
import { AuthService } from './core/services/auth.service';
import { SidebarService } from './core/services/sidebar.service';
import { WebSocketService } from './core/services/websocket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TranslateModule, NavbarComponent, FooterComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  // ✅ existing injections
  authService = inject(AuthService);
  sidebarService = inject(SidebarService);

  // ✅ new injections for WebSocket and routing
  private webSocketService = inject(WebSocketService);
  private router = inject(Router);

  private sessionSub?: Subscription;

  ngOnInit(): void {
    // ✅ if user is logged in, connect to WebSocket
    const currentUserSignal = this.authService.getCurrentUser();
    const currentUser = currentUserSignal(); // unwrap signal value

    if (currentUser) {
      console.log('🔗 WebSocket: Connecting for user', currentUser.email);
      this.webSocketService.connect();

      // ✅ Listen for backend session termination events
      this.sessionSub = this.webSocketService.sessionEvents$.subscribe((event) => {
        if (event?.type === 'SESSION_TERMINATED') {
          const activeUser = this.authService.getCurrentUser()();
          if (activeUser && event.username === activeUser.email) {
            console.warn('⚠️ Session terminated by admin');
            alert('⚠️ Your session was terminated by the administrator.');
            this.authService.logout();
            this.router.navigate(['/login']);
          }
        }
      });
    }
  }

  ngOnDestroy(): void {
    // ✅ cleanup
    if (this.sessionSub) this.sessionSub.unsubscribe();
    this.webSocketService.disconnect();
  }
}
