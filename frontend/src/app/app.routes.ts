import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/auth/login-component/login.component';
import { RegisterComponent } from './features/auth/register-component/register.component';
import { JobsComponent } from './features/jobs/jobs.component';
import { JobDetailComponent } from './features/jobs/job-detail.component';
import { CompaniesComponent } from './features/companies/companies.component';
import { CompanyDetailComponent } from './features/companies/company-detail.component';
import { ApplicationsComponent } from './features/applications/applications.component';
import { ProfileComponent } from './features/profile/profile.component';
import { ResumeUploadComponent } from './features/resume-upload/resume-upload.component';
import { ResumesComponent } from './features/resumes/resumes.component';
import { CandidateMatchingComponent } from './features/candidate-matching/candidate-matching.component';
import { AdminComponent } from './features/admin/admin.component';
import { ManageCompaniesComponent } from './features/admin/manage-companies.component/manage-companies.component';
// import { RolesPermissionComponent } from './features/admin/roles-permission.component/roles-permission.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'jobs', component: JobsComponent },
  { path: 'jobs/:id', component: JobDetailComponent },
  { path: 'companies', component: CompaniesComponent },
  { path: 'companies/:id', component: CompanyDetailComponent },
  { path: 'applications', component: ApplicationsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'resume-upload', component: ResumeUploadComponent },
  { path: 'resumes', component: ResumesComponent },
  { path: 'candidate-matching', component: CandidateMatchingComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'manage-companies', component:ManageCompaniesComponent},
  // { path: 'roles-permission', component:RolesPermissionComponent},
  { path: '**', redirectTo: '' }
];
