import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentStatus } from '../../../core/models/document.model';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-badge.html',
  styleUrls: ['./status-badge.scss']
})
export class StatusBadgeComponent {
  @Input() status!: DocumentStatus;

  get badgeClass(): string {
    switch (this.status) {
      case 'Compliant': return 'badge-compliant';
      case 'ExpiringSoon': return 'badge-expiring';
      case 'Overdue': return 'badge-overdue';
      case 'UnderReview': return 'badge-review';
      default: return 'badge-default';
    }
  }

  get statusLabel(): string {
    switch (this.status) {
      case 'Compliant': return 'Compliant';
      case 'ExpiringSoon': return 'Expiring Soon';
      case 'Overdue': return 'Overdue';
      case 'UnderReview': return 'Under Review';
      default: return this.status;
    }
  }
}
