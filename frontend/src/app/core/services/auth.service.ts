import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { UserRole } from '../models/rbac.types';

export interface User {
  userId?: string; // ✅ changed from id → userId to match backend response
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

  // 🔹 Computed role signal (declared after restore)
  private userRole!: ReturnType<typeof computed<UserRole>>;

  private apiUrl = environment.apiUrl;
  sessionManagerService: any;

  constructor(private router: Router) {
    // 🔹 Restore session from localStorage on load
    const savedUser = localStorage.getItem('currentUser');
    const savedToken = localStorage.getItem('token');

    if (savedUser && savedToken) {
      this.currentUser.set(JSON.parse(savedUser));
      this.isAuthenticated.set(true);
    }

    // 🔹 Compute current role
    this.userRole = computed<UserRole>(() => {
      const user = this.currentUser();
      return (user?.role as UserRole) || 'GUEST';
    });
  }

  // 🔹 Readonly reactive accessors
  getCurrentUser() {
    return this.currentUser.asReadonly();
  }

  getIsAuthenticated() {
    return this.isAuthenticated.asReadonly();
  }

  getUserRole() {
    return this.userRole;
  }

  // ==========================================================
  // 🔹 LOGIN
  // ==========================================================
  async login(email: string, password: string): Promise<boolean> {
  try {
    const response = await fetch(`${this.apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      console.error('Login failed with status', response.status);
      return false;
    }

    const data = await response.json();
    console.log('Login response from backend:', data); // <-- Check keys here

    // ✅ Debug safeguard: detect userId under multiple possible keys
    const id =
      data.userId || data.id || data.uid || null;

    if (!id) {
      console.warn('No userId found in backend response:', data);
    }

    const user: User = {
      userId: id,
      fullName: data.fullName,
      email: data.email,
      role: data.role,
      token: data.token
    };

    // ✅ Save to localStorage
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('token', data.token);

    // ✅ Update reactive signals
    this.currentUser.set(user);
    this.isAuthenticated.set(true);

    console.log('✅ Stored currentUser in localStorage:', user);
    return true;
  } catch (err) {
    console.error('Login error:', err);
    return false;
  }
}


  // ==========================================================
  // 🔹 REGISTER
  // ==========================================================
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

      if (!response.ok) {
        console.error('Registration failed with status', response.status);
        return false;
      }

      const data = await response.json();
      console.log('Register response from backend:', data);

      const user: User = {
        userId: data.userId,
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

  // ==========================================================
// 🔹 LOGOUT (with correct session termination)
// ==========================================================
async logout() {
  const current = this.currentUser();

  if (current?.email) {
    try {
      // 1️⃣ Get all current sessions
      const sessions = await this.sessionManagerService.getSessions().toPromise();

      // 2️⃣ Find the matching session by username/email
      const mySession = sessions?.find(
        (s: { username: string; status: string; }) => s.username.toLowerCase() === current.email.toLowerCase() && s.status === 'active'
      );

      if (mySession) {
        // 3️⃣ Terminate the correct session by ID
        await this.sessionManagerService.terminateSession(mySession.id).toPromise();
        console.log('Session terminated for user:', current.email);
      } else {
        console.warn('No matching active session found for', current.email);
      }
    } catch (err) {
      console.warn('Failed to terminate backend session:', err);
    }
  }

  // 🔹 4️⃣ Local cleanup
  this.currentUser.set(null);
  this.isAuthenticated.set(false);
  localStorage.removeItem('currentUser');
  localStorage.removeItem('token');

  // 🔹 5️⃣ Redirect to login
  await this.router.navigate(['/login']);
  console.log('User logged out and session cleared.');
}


  // ==========================================================
  // 🔹 PROFILE UPDATE (frontend-only cache)
  // ==========================================================
  updateProfile(updates: Partial<User>) {
    const current = this.currentUser();
    if (current) {
      const updated = { ...current, ...updates };
      this.currentUser.set(updated);
      localStorage.setItem('currentUser', JSON.stringify(updated));
    }
  }

  // ==========================================================
  // 🔹 TOKEN GETTER
  // ==========================================================
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
