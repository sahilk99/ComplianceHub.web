import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DocumentService } from '../../../core/services/document.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge';
import { Document } from '../../../core/models/document.model';
import { AuditLog } from '../../../core/models/audit-log.model';

@Component({
  selector: 'app-document-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusBadgeComponent],
  templateUrl: './document-detail.html',
  styleUrls: ['./document-detail.css']
})
export class DocumentDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private documentService = inject(DocumentService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private http = inject(HttpClient);

  document: Document | null = null;
  auditLogs: AuditLog[] = [];
  
  userRole = this.authService.getUserRole();
  isAdmin = this.userRole === 'Admin';
  isLoading = true;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadDocument(id);
      this.loadAuditLogs(id);
    }
  }

  loadDocument(id: string): void {
    this.isLoading = true;
    this.documentService.getDocument(id).subscribe({
      next: (doc) => {
        this.document = doc;
        this.isLoading = false;
      },
      error: () => {
        this.notificationService.showError('Failed to load document details');
        this.isLoading = false;
      }
    });
  }

  loadAuditLogs(id: string): void {
    // Calling the endpoint as requested: GET /api/audit-logs/document/{id}
    this.http.get<AuditLog[]>(`https://localhost:7123/api/audit-logs/document/${id}`).subscribe({
      next: (logs) => this.auditLogs = logs,
      error: () => console.error('Failed to load audit logs')
    });
  }
}
