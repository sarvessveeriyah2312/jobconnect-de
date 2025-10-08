import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { JobService } from '../../core/services/job.service';
import { CompanyService } from '../../core/services/company.service';
import { ResumeService } from '../../core/services/resume.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  jobs = this.jobService.getJobs();
  companies = this.companyService.getCompanies();
  resumes = this.resumeService.getResumes();

  constructor(
    private jobService: JobService,
    private companyService: CompanyService,
    private resumeService: ResumeService
  ) {}
}
