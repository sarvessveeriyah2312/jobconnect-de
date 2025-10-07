import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  skills?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = signal<User | null>(null);
  private isAuthenticated = signal<boolean>(false);

  constructor(private router: Router) {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUser.set(JSON.parse(savedUser));
      this.isAuthenticated.set(true);
    }
  }

  getCurrentUser() {
    return this.currentUser.asReadonly();
  }

  getIsAuthenticated() {
    return this.isAuthenticated.asReadonly();
  }

  async login(email: string, password: string): Promise<boolean> {
    const response = await fetch('/assets/data/users.json');
    const users = await response.json();

    const user = users.find((u: any) => u.email === email && u.password === password);

    if (user) {
      const { password, ...userWithoutPassword } = user;
      this.currentUser.set(userWithoutPassword);
      this.isAuthenticated.set(true);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return true;
    }

    return false;
  }

  async register(name: string, email: string, password: string): Promise<boolean> {
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      bio: '',
      skills: []
    };

    this.currentUser.set(newUser);
    this.isAuthenticated.set(true);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return true;
  }

  logout() {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/']);
  }

  updateProfile(updates: Partial<User>) {
    const current = this.currentUser();
    if (current) {
      const updated = { ...current, ...updates };
      this.currentUser.set(updated);
      localStorage.setItem('currentUser', JSON.stringify(updated));
    }
  }
}
