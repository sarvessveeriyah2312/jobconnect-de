import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  isCollapsed = signal(false);

  toggle() {
    this.isCollapsed.update(c => !c);
  }

  getState() {
    return this.isCollapsed();
  }
}
