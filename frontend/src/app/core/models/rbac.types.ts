export enum UserRole {
  ADMIN = 'ADMIN',
  RECRUITER = 'RECRUITER',
  CANDIDATE = 'JOB_APPLICANT',
  GUEST = 'guest'
}

export interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
}

export interface RoleConfig {
  role: UserRole;
  label: string;
  permissions: Permission[];
}

export interface FeatureToggle {
  id: number;
  name: string;
  enabled: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RoleConfig> = {
  
  [UserRole.ADMIN]: {
    role: UserRole.ADMIN,
    label: 'Administrator',
    permissions: [
      { resource: 'jobs', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'companies', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'resumes', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'applications', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'matching', actions: ['read'] }
    ]
  },
  [UserRole.RECRUITER]: {
    role: UserRole.RECRUITER,
    label: 'Recruiter',
    permissions: [
      { resource: 'jobs', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'companies', actions: ['read', 'update'] },
      { resource: 'resumes', actions: ['read'] },
      { resource: 'applications', actions: ['read', 'update'] },
      { resource: 'matching', actions: ['read'] }
    ]
  },
  [UserRole.CANDIDATE]: {
    role: UserRole.CANDIDATE,
    label: 'Candidate',
    permissions: [
      { resource: 'jobs', actions: ['read'] },
      { resource: 'companies', actions: ['read'] },
      { resource: 'resumes', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'applications', actions: ['create', 'read'] }
    ]
  },
  [UserRole.GUEST]: {
    role: UserRole.GUEST,
    label: 'Guest',
    permissions: [
      { resource: 'jobs', actions: ['read'] },
      { resource: 'companies', actions: ['read'] }
    ]
  }
};

export interface NavigationItem {
  label: string;
  translationKey: string;
  icon: string;
  path: string;
  roles: UserRole[];
  children?: NavigationItem[];
}

export const NAVIGATION_CONFIG: NavigationItem[] = [

  //Administator
  {
    label: 'Dashboard',
    translationKey: 'navbar.dashboard',
    icon: 'home',
    path: '/admin',
    roles: [UserRole.ADMIN]
  },
    {
    label: 'Roles & Permission',
    translationKey: 'navbar.rolesnpermission',
    icon: 'home',
    path: '/roles-permission',
    roles: [UserRole.ADMIN]
  },
    {
    label: 'Manage Companies',
    translationKey: 'navbar.manageCompanies', 
    icon: 'home',
    path: '/manage-companies',
    roles: [UserRole.ADMIN]
  },

   {
    label: 'Manage User',
    translationKey: 'navbar.manageUsers', 
    icon: 'home',
    path: '/manage-users',
    roles: [UserRole.ADMIN]
  },

    {
    label: 'Traffic Analytics',
    translationKey: 'navbar.trafficAnalytics', 
    icon: 'home',
    path: '/traffic-analytics',
    roles: [UserRole.ADMIN]
  },

      {
    label: 'System Logs',
    translationKey: 'navbar.systemLogs', 
    icon: 'home',
    path: '/system-logs',
    roles: [UserRole.ADMIN]
  },




  // {
  //   label: 'Jobs',
  //   translationKey: 'navbar.jobs',
  //   icon: 'briefcase',
  //   path: '/jobs',
  //   roles: [UserRole.ADMIN, UserRole.RECRUITER, UserRole.CANDIDATE, UserRole.GUEST]
  // },
  // {
  //   label: 'Companies',
  //   translationKey: 'navbar.companies',
  //   icon: 'building',
  //   path: '/companies',
  //   roles: [UserRole.ADMIN, UserRole.RECRUITER, UserRole.CANDIDATE, UserRole.GUEST]
  // },
  // {
  //   label: 'Applications',
  //   translationKey: 'navbar.applications',
  //   icon: 'document',
  //   path: '/applications',
  //   roles: [UserRole.ADMIN, UserRole.CANDIDATE]
  // },
  // {
  //   label: 'Resumes',
  //   translationKey: 'navbar.resumes',
  //   icon: 'document-text',
  //   path: '/resumes',
  //   roles: [UserRole.ADMIN, UserRole.CANDIDATE]
  // },
  // {
  //   label: 'Upload Resume',
  //   translationKey: 'resume.uploadTitle',
  //   icon: 'upload',
  //   path: '/resume-upload',
  //   roles: [UserRole.ADMIN, UserRole.CANDIDATE]
  // },
  // {
  //   label: 'Candidate Matching',
  //   translationKey: 'matching.title',
  //   icon: 'users',
  //   path: '/candidate-matching',
  //   roles: [UserRole.ADMIN, UserRole.RECRUITER]
  // },
  // {
  //   label: 'Admin Dashboard',
  //   translationKey: 'navbar.admin',
  //   icon: 'chart-bar',
  //   path: '/admin',
  //   roles: [UserRole.ADMIN]
  // },
  // {
  //   label: 'Profile',
  //   translationKey: 'navbar.profile',
  //   icon: 'user',
  //   path: '/profile',
  //   roles: [UserRole.ADMIN, UserRole.RECRUITER, UserRole.CANDIDATE]
  // }
];
