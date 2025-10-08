import { Component, Input, Output, EventEmitter, TemplateRef, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomPaginationComponent } from '../custom-pagination/custom-pagination.component';

@Component({
  selector: 'app-custom-table',
  standalone: true,
  imports: [CommonModule, CustomPaginationComponent],
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.scss']
})
export class CustomTableComponent {
  /** Inputs */
  @Input() columns: { field: string; header: string; sortable?: boolean; template?: TemplateRef<any> }[] = [];
  @Input() data: any[] = [];
  @Input() actions: string[] = [];
  @Input() bulkActions: { id: string; label: string; icon?: string }[] = [];
  @Input() selectable = true;
  @Input() sortable = true;
  @Input() pagination = false;
  @Input() pageSize = 10;

  /** Outputs */
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() view = new EventEmitter<any>();
  @Output() bulkAction = new EventEmitter<{ action: string; items: any[] }>();
  @Output() moreAction = new EventEmitter<{ item: any; action: string }>();

  /** State Signals */
  selectedItems = signal<any[]>([]);
  sortField = signal<string>('');
  sortDirection = signal<'asc' | 'desc' | null>(null);
  currentPage = signal<number>(1);
  openDropdownId = signal<string | null>(null);

  /** Computed values */
  allSelected = computed(() => this.data.length > 0 && this.selectedItems().length === this.data.length);
  totalItems = computed(() => this.data.length);
  totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize));

  /** Sorted and paginated data */
  sortedData = computed(() => {
    let result = [...this.data];

    const field = this.sortField();
    const dir = this.sortDirection();

    if (field && dir && this.sortable) {
      result.sort((a, b) => {
        const aVal = a[field];
        const bVal = b[field];
        if (aVal < bVal) return dir === 'asc' ? -1 : 1;
        if (aVal > bVal) return dir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    if (this.pagination) {
      const start = (this.currentPage() - 1) * this.pageSize;
      result = result.slice(start, start + this.pageSize);
    }

    return result;
  });

  /** Selection Logic */
  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectedItems.set(checked ? [...this.data] : []);
  }

  toggleSelection(item: any): void {
    const selected = this.selectedItems();
    if (this.isSelected(item)) {
      this.selectedItems.set(selected.filter(i => i.id !== item.id));
    } else {
      this.selectedItems.set([...selected, item]);
    }
  }

  isSelected(item: any): boolean {
    return this.selectedItems().some(i => i.id === item.id);
  }

  /** Sorting Logic */
  onSort(field: string): void {
    if (this.sortField() === field) {
      if (this.sortDirection() === 'asc') this.sortDirection.set('desc');
      else if (this.sortDirection() === 'desc') this.sortDirection.set(null);
      else this.sortDirection.set('asc');
    } else {
      this.sortField.set(field);
      this.sortDirection.set('asc');
    }
  }

  getSortDirection(field: string): 'asc' | 'desc' | null {
    return this.sortField() === field ? this.sortDirection() : null;
  }

  /** Pagination */
  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  /** Actions */
  onEdit(item: any): void {
    this.edit.emit(item);
  }

  onDelete(item: any): void {
    this.delete.emit(item);
  }

  onView(item: any): void {
    this.view.emit(item);
  }

  onMoreAction(item: any, action: string): void {
    this.moreAction.emit({ item, action });
  }

  onBulkAction(actionId: string): void {
    this.bulkAction.emit({ action: actionId, items: this.selectedItems() });
  }

  /** Dropdown */
  toggleDropdown(id: string): void {
    this.openDropdownId.set(this.openDropdownId() === id ? null : id);
  }

  closeDropdown(): void {
    this.openDropdownId.set(null);
  }

  /** Utility */
  getColSpan(): number {
    let count = this.columns.length;
    if (this.selectable) count++;
    if (this.actions.length > 0) count++;
    return count;
  }

  Math = Math;
}
