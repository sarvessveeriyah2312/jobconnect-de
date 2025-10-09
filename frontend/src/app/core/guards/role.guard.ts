import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/rbac.types';

export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const userRole = authService.getUserRole()();
    const hasAccess = allowedRoles.includes(userRole);

    if (!hasAccess) {
      router.navigate(['/']);
      return false;
    }

    return true;
  };
};

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = authService.getIsAuthenticated()();

  if (!isAuthenticated) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
