import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Permission {
  id: number;
  code: string;
  description: string;
  category: string;
  isRequired?: boolean;
}
export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: Permission[];
  isSystem?: boolean;
}
export interface PermissionCategory {
  id: string;
  name: string;
  description: string;
}
export interface User {
  id: number;
  name: string;
  email: string;
  roleId: number;
}
export interface FeatureToggle {
  id: number;
  name: string;
  enabled: boolean;
}

@Injectable({ providedIn: 'root' })
export class RbacService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/rbac`;

  roles = signal<Role[]>([]);
  permissions = signal<Permission[]>([]);
  users = signal<User[]>([]);
  permissionCategories = signal<PermissionCategory[]>([]);
  features = signal<FeatureToggle[]>([]);

  /** ---------------- ROLES ---------------- */
  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.baseUrl}/roles`).pipe(
      tap(data => this.roles.set(data))
    );
  }
  createRole(payload: Partial<Role>): Observable<Role> {
    return this.http.post<Role>(`${this.baseUrl}/roles`, payload).pipe(
      tap(role => this.roles.update(r => [...r, role]))
    );
  }
  updateRole(id: number, payload: Partial<Role>): Observable<Role> {
    return this.http.put<Role>(`${this.baseUrl}/roles/${id}`, payload).pipe(
      tap(updated => this.roles.update(r => r.map(x => x.id === id ? updated : x)))
    );
  }
  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/roles/${id}`).pipe(
      tap(() => this.roles.update(r => r.filter(x => x.id !== id)))
    );
  }

  /** ---------------- PERMISSIONS ---------------- */
  getPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${this.baseUrl}/permissions`).pipe(
      tap(data => this.permissions.set(data))
    );
  }
  getPermissionCategories(): Observable<PermissionCategory[]> {
    return this.http.get<PermissionCategory[]>(`${this.baseUrl}/permission-categories`).pipe(
      tap(data => this.permissionCategories.set(data))
    );
  }

  /** ---------------- USERS ---------------- */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`).pipe(
      tap(data => this.users.set(data))
    );
  }

  /** ---------------- FEATURES ---------------- */
  getFeatures(): Observable<FeatureToggle[]> {
    return this.http.get<FeatureToggle[]>(`${this.baseUrl}/features`).pipe(
      tap(data => this.features.set(data))
    );
  }
  updateFeature(id: number, payload: Partial<FeatureToggle>): Observable<FeatureToggle> {
    return this.http.put<FeatureToggle>(`${this.baseUrl}/features/${id}`, payload).pipe(
      tap(updated =>
        this.features.update(f => f.map(x => (x.id === id ? updated : x)))
      )
    );
  }
}
