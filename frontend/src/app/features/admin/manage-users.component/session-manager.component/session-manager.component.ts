import { Component, OnInit, inject, TemplateRef, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SessionManagerService, UserSession } from '../../../../core/services/session-manager.service';
import { CustomTableComponent } from '../../../../core/components/custom-table/custom-table.component';

@Component({
  selector: 'app-session-manager',
  standalone: true,
  imports: [CommonModule, TranslateModule, CustomTableComponent],
  templateUrl: './session-manager.component.html',
  styleUrls: ['./session-manager.component.scss']
})
export class SessionManagerComponent implements OnInit {
  private sessionService = inject(SessionManagerService);

  @ViewChild('sessionDetailTemplate', { static: true }) sessionDetailTemplate!: TemplateRef<any>;

  sessions: UserSession[] = [];
  loading = true;

  /** ✅ Dashboard signals */
  totalSessions = signal(0);
  activeSessions = signal(0);
  terminatedSessions = signal(0);
  avgDuration = signal(0);

  /** ✅ Table configuration */
  columns = [
    { field: 'username', header: 'sessionManager.table.user', sortable: true },
    { field: 'role', header: 'sessionManager.table.role', sortable: true },
    { field: 'ipAddress', header: 'sessionManager.table.ip', sortable: true },
    { field: 'userAgent', header: 'sessionManager.table.device', sortable: false },
    { field: 'loginTime', header: 'sessionManager.table.loginTime', sortable: true },
    { field: 'lastActive', header: 'sessionManager.table.lastActive', sortable: true },
    { field: 'status', header: 'sessionManager.table.status', sortable: true }
  ];

  actions = ['delete'];
  bulkActions = [
    { id: 'terminateAll', label: 'Terminate Selected', icon: '<i class="fa-solid fa-ban"></i>' }
  ];

  ngOnInit(): void {
    this.loadSessions();
  }

  /** 🔹 Fetch sessions from backend */
loadSessions(): void {
  this.loading = true;
  this.sessionService.getSessions().subscribe({
    next: (data) => {
      this.sessions = data.map(s => ({
        ...s,
        status: (s.status?.toLowerCase() as 'active' | 'terminated') ?? 'active'
      }));
      this.loading = false;
      this.updateStats();
    },
    error: (err) => {
      console.error('Failed to load sessions', err);
      this.loading = false;
    },
  });
}



  /** 🔹 Terminate a single session */
  onDelete(session: UserSession): void {
    this.terminateSession(session);
  }

  terminateSession(session: UserSession): void {
    if (!confirm(`Are you sure you want to terminate ${session.username}'s session?`)) return;

    this.sessionService.terminateSession(session.id).subscribe({
      next: () => {
        // Remove locally
        this.sessions = this.sessions.filter(s => s.id !== session.id);
        this.updateStats();
      },
      error: (err) => console.error('❌ Failed to terminate session', err),
    });
  }

  /** 🔹 Bulk terminate all */
  onBulkAction(event: { action: string; items: UserSession[] }): void {
    if (event.action === 'terminateAll') this.terminateAll();
  }

  terminateAll(): void {
    if (!confirm('Terminate all active sessions? This will log out all users.')) return;

    this.sessionService.terminateAllSessions().subscribe({
      next: () => {
        this.sessions = [];
        this.updateStats();
      },
      error: (err) => console.error('❌ Failed to terminate all sessions', err),
    });
  }

  /** 🔹 Update dashboard stats */
updateStats(): void {
  this.totalSessions.set(this.sessions.length);
  this.activeSessions.set(this.sessions.filter(s => s.status.toLowerCase() === 'active').length);
  this.terminatedSessions.set(this.sessions.filter(s => s.status.toLowerCase() === 'terminated').length);
  this.avgDuration.set(this.getAverageDuration());
}

getActiveSessionsCount(): number {
  return this.sessions.filter(s => s.status.toLowerCase() === 'active').length;
}

  /** 🔹 Utility: Average duration of active sessions */
getAverageDuration(sessions: UserSession[] = this.sessions): number {
  const activeSessions = sessions.filter(s => s.status?.toLowerCase() === 'active');
  if (activeSessions.length === 0) return 0;

  const totalDuration = activeSessions.reduce((sum, session) => {
    return sum + this.calculateDurationInMinutes(session);
  }, 0);

  return Math.round(totalDuration / activeSessions.length);
}


  /** 🔹 Duration helpers */
  calculateDurationInMinutes(session: UserSession): number {
    const loginTime = new Date(session.loginTime).getTime();
    const lastActive = new Date(session.lastActive).getTime();
    return Math.max(0, Math.round((lastActive - loginTime) / (1000 * 60)));
  }

  calculateDuration(session: UserSession): string {
    const minutes = this.calculateDurationInMinutes(session);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }

  /** 🔹 Session age (since login) */
  calculateSessionAge(session: UserSession): string {
    const loginTime = new Date(session.loginTime).getTime();
    const now = new Date().getTime();
    const minutes = Math.round((now - loginTime) / (1000 * 60));

    if (minutes < 60) return `${minutes}m`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h`;
    return `${Math.floor(minutes / 1440)}d`;
  }

  /** 🔹 Time ago formatter */
  getTimeAgo(timestamp: string): string {
    const time = new Date(timestamp).getTime();
    const now = new Date().getTime();
    const diffInMinutes = Math.round((now - time) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  }

  /** 🔹 Status helpers */
  getStatusClass(status: string): string {
    const statusClasses: Record<string, string> = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
      expired: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      terminated: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    };
    return statusClasses[status] || statusClasses['inactive'];
  }

  getStatusIcon(status: string): string {
    const statusIcons: Record<string, string> = {
      active: 'fa-solid fa-circle-play',
      inactive: 'fa-solid fa-circle-pause',
      expired: 'fa-solid fa-clock',
      terminated: 'fa-solid fa-power-off'
    };
    return statusIcons[status] || 'fa-solid fa-circle-question';
  }

  /** 🔹 Parse user agent */
  parseUserAgent(userAgent: string): { browser: string; os: string; device: string } {
    let browser = 'Unknown';
    let os = 'Unknown';
    let device = 'Desktop';

    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';

    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iOS')) os = 'iOS';

    if (userAgent.includes('Mobile')) device = 'Mobile';
    else if (userAgent.includes('Tablet')) device = 'Tablet';

    return { browser, os, device };
  }

  /** 🔹 Clipboard copy */
  copySessionId(session: UserSession): void {
    navigator.clipboard.writeText(session.id).then(() => {
      console.log('✅ Session ID copied:', session.id);
    });
  }

  /** 🔹 Placeholder refresh */
  refreshSession(session: UserSession): void {
    console.log('🔄 Refreshing session:', session.id);
  }

  /** 🔹 Optional detail expansion */
  onSessionExpand(event: { item: UserSession; expanded: boolean }): void {
    if (event.expanded) console.log('🔍 Session expanded:', event.item.username);
  }
}
