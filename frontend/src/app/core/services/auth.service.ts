import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { UserRole } from '../models/rbac.types';

export interface User {
  id?: string;
  fullName: string;
  email: string;
  role?: string;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // 🔹 Reactive user and auth state
  private currentUser = signal<User | null>(null);
  private isAuthenticated = signal<boolean>(false);

  // 🔹 Role signal (declared after restore)
  private userRole!: ReturnType<typeof computed<UserRole>>;

  private apiUrl = environment.apiUrl;

  constructor(private router: Router) {
    // 🔹 Restore saved user before computing role
    const savedUser = localStorage.getItem('currentUser');
    const savedToken = localStorage.getItem('token');

    if (savedUser && savedToken) {
      this.currentUser.set(JSON.parse(savedUser));
      this.isAuthenticated.set(true);
    }

    // 🔹 Define computed AFTER user restoration
    this.userRole = computed<UserRole>(() => {
      const user = this.currentUser();
      return (user?.role as UserRole) || 'GUEST';
    });
  }

  // 🔹 Expose readonly reactive getters
  getCurrentUser() {
    return this.currentUser.asReadonly();
  }

  getIsAuthenticated() {
    return this.isAuthenticated.asReadonly();
  }

  getUserRole() {
    return this.userRole;
  }

  // 🔹 Login with backend
  async login(email: string, password: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) return false;
      const data = await response.json();

      const user: User = {
        fullName: data.fullName,
        email: data.email,
        role: data.role,
        token: data.token
      };

      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('token', data.token);

      this.currentUser.set(user);
      this.isAuthenticated.set(true);
      return true;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  }

  // 🔹 Register a new user
  async register(
    fullName: string,
    email: string,
    password: string,
    role: string = 'JOB_APPLICANT'
  ): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password, role })
      });

      if (!response.ok) return false;
      const data = await response.json();

      const user: User = {
        fullName: data.fullName,
        email: data.email,
        role: data.role,
        token: data.token
      };

      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('token', data.token);

      this.currentUser.set(user);
      this.isAuthenticated.set(true);
      return true;
    } catch (err) {
      console.error('Registration error:', err);
      return false;
    }
  }

  // 🔹 Logout and clear session
  logout() {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  // 🔹 Update user profile (frontend only)
  updateProfile(updates: Partial<User>) {
    const current = this.currentUser();
    if (current) {
      const updated = { ...current, ...updates };
      this.currentUser.set(updated);
      localStorage.setItem('currentUser', JSON.stringify(updated));
    }
  }

  // 🔹 Helper to get JWT
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
