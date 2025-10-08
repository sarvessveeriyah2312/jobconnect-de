import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomModalComponent } from '../../../core/components/custom-modal/custom-modal.component';
import { CustomTableComponent } from '../../../core/components/custom-table/custom-table.component';
import { TranslateModule } from '@ngx-translate/core';



interface Company {
  id: number;
  name: string;
  location: string;
  email: string;
}

@Component({
  selector: 'app-manage-companies',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomTableComponent, CustomModalComponent, TranslateModule],
  templateUrl: './manage-companies.component.html',
  styleUrls: ['./manage-companies.component.scss']
})
export class ManageCompaniesComponent {
  companies = signal<Company[]>([
    { id: 1, name: 'TechNova GmbH', location: 'Berlin', email: 'info@technova.de' },
    { id: 2, name: 'CodeHaus AG', location: 'Munich', email: 'contact@codehaus.de' },
  ]);

  showModal = signal(false);
  newCompany = signal<Partial<Company>>({});

  columns = [
    { field: 'name', header: 'Company Name' },
    { field: 'location', header: 'Location' },
    { field: 'email', header: 'Email' }
  ];

  openAddModal() {
    this.newCompany.set({});
    this.showModal.set(true);
  }

  saveCompany() {
    const newEntry = { ...this.newCompany(), id: Date.now() } as Company;
    this.companies.update(list => [...list, newEntry]);
    this.showModal.set(false);
  }

  deleteCompany(company: Company) {
    this.companies.update(list => list.filter(c => c.id !== company.id));
  }

  editCompany(company: Company) {
    this.newCompany.set({ ...company });
    this.showModal.set(true);
  }
}
