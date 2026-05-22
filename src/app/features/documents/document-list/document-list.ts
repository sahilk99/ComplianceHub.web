import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DocumentService } from '../../../core/services/document.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge';
import { Document } from '../../../core/models/document.model';

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, StatusBadgeComponent],
  templateUrl: './document-list.html',
  styleUrls: ['./document-list.css']
})
export class DocumentList implements OnInit {
  private documentService = inject(DocumentService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);

  documents: Document[] = [];
  
  userRole = this.authService.getUserRole();
  isAdmin = this.userRole === 'Admin';

  filterForm = this.fb.group({
    category: [''],
    status: [''],
    titleSearch: ['']
  });

  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  totalCount = 0;

  categories = ['Policy', 'Certificate', 'Contract', 'License'];
  statuses = ['Compliant', 'ExpiringSoon', 'Overdue', 'UnderReview'];

  ngOnInit(): void {
    this.loadDocuments();
    this.filterForm.valueChanges.subscribe(() => {
      this.currentPage = 1;
      this.loadDocuments();
    });
  }

  loadDocuments(): void {
    const filters = {
      category: this.filterForm.value.category || undefined,
      status: this.filterForm.value.status || undefined,
      page: this.currentPage,
      pageSize: this.pageSize
    };

    this.documentService.getDocuments(filters).subscribe({
      next: (response) => {
        let filteredDocs = response.data || [];
        const searchTerm = this.filterForm.value.titleSearch?.toLowerCase() || '';
        
        if (searchTerm) {
          filteredDocs = filteredDocs.filter(d => d.title.toLowerCase().includes(searchTerm));
        }
        
        this.documents = filteredDocs;
        this.totalPages = response.totalPages || 1;
        this.totalCount = response.totalCount || filteredDocs.length;
      },
      error: (err) => this.notificationService.showError('Failed to load documents')
    });
  }

  clearFilters(): void {
    this.filterForm.reset({
      category: '',
      status: '',
      titleSearch: ''
    }, { emitEvent: false }); // Prevent multiple API calls
    this.currentPage = 1;
    this.loadDocuments();
  }

  deleteDocument(id: string): void {
    if (confirm('Are you sure you want to delete this document?')) {
      this.documentService.deleteDocument(id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Document deleted successfully');
          this.loadDocuments();
        },
        error: () => this.notificationService.showError('Failed to delete document')
      });
    }
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadDocuments();
    }
  }

  onPageSizeChange(event: any): void {
    this.pageSize = Number(event.target.value);
    this.currentPage = 1;
    this.loadDocuments();
  }

  getRowClass(status: string): string {
    if (status === 'Overdue') return 'row-overdue';
    if (status === 'ExpiringSoon') return 'row-expiring';
    return '';
  }
}
