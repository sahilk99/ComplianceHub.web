import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuditLogService } from '../../core/services/audit-log.service';
import { AuditLog } from '../../core/models/audit-log.model';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './audit-logs.html',
  styleUrls: ['./audit-logs.css']
})
export class AuditLogsComponent implements OnInit {
  private auditLogService = inject(AuditLogService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  logs: AuditLog[] = [];
  
  filterForm = this.fb.group({
    fromDate: [''],
    toDate: [''],
    action: [''],
    entityType: ['']
  });

  currentPage = 1;
  pageSize = 20;
  totalPages = 1;
  totalCount = 0;

  actions = ['Created', 'Updated', 'Deleted', 'Viewed'];
  entityTypes = ['Document', 'User', 'Department'];
  Math = Math;

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    const filters = {
      fromDate: this.filterForm.value.fromDate || undefined,
      toDate: this.filterForm.value.toDate || undefined,
      action: this.filterForm.value.action || undefined,
      entityType: this.filterForm.value.entityType || undefined,
      page: this.currentPage,
      pageSize: this.pageSize
    };

    this.auditLogService.getLogs(filters).subscribe({
      next: (response) => {
        this.logs = response.data || [];
        this.totalPages = response.totalPages || 1;
        this.totalCount = response.totalCount || this.logs.length;
      },
      error: (err) => console.error('Failed to load audit logs', err)
    });
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadLogs();
  }

  clearFilters(): void {
    this.filterForm.reset({
      fromDate: '',
      toDate: '',
      action: '',
      entityType: ''
    });
    this.currentPage = 1;
    this.loadLogs();
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadLogs();
    }
  }

  onPageSizeChange(event: any): void {
    this.pageSize = Number(event.target.value);
    this.currentPage = 1;
    this.loadLogs();
  }

  navigateToEntity(type: string, id: string): void {
    if (type.toLowerCase() === 'document') {
      this.router.navigate(['/documents', id]);
    } else if (type.toLowerCase() === 'user') {
      // Assuming a users view exists, this is standard
      this.router.navigate(['/users', id]);
    }
  }

  getActionColor(action: string): string {
    switch (action.toLowerCase()) {
      case 'created': return 'badge-success';
      case 'updated': return 'badge-info';
      case 'deleted': return 'badge-danger';
      case 'viewed': return 'badge-secondary';
      default: return 'badge-primary';
    }
  }
}
