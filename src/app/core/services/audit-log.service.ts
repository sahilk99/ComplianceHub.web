import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuditLog, PaginatedResponse } from '../models/audit-log.model';

@Injectable({
  providedIn: 'root'
})
export class AuditLogService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7123/api/audit-logs';

  getLogs(filters?: { fromDate?: string, toDate?: string, action?: string, entityType?: string, page?: number, pageSize?: number }): Observable<PaginatedResponse<AuditLog>> {
    let params = new HttpParams();
    if (filters) {
      if (filters.fromDate) params = params.set('fromDate', filters.fromDate);
      if (filters.toDate) params = params.set('toDate', filters.toDate);
      if (filters.action) params = params.set('action', filters.action);
      if (filters.entityType) params = params.set('entityType', filters.entityType);
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.pageSize) params = params.set('pageSize', filters.pageSize.toString());
    }
    return this.http.get<PaginatedResponse<AuditLog>>(this.apiUrl, { params });
  }
}
