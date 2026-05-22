import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Document, CreateDocument } from '../models/document.model';
import { PaginatedResponse } from '../models/audit-log.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7123/api/documents';

  getDocuments(filters?: { category?: string, status?: string, departmentId?: number, page?: number, pageSize?: number }): Observable<PaginatedResponse<Document>> {
    let params = new HttpParams();
    if (filters) {
      if (filters.category) params = params.set('category', filters.category);
      if (filters.status) params = params.set('status', filters.status);
      if (filters.departmentId) params = params.set('departmentId', filters.departmentId.toString());
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.pageSize) params = params.set('pageSize', filters.pageSize.toString());
    }
    return this.http.get<PaginatedResponse<Document>>(this.apiUrl, { params });
  }

  getDocument(id: string): Observable<Document> {
    return this.http.get<Document>(`${this.apiUrl}/${id}`);
  }

  createDocument(data: CreateDocument): Observable<Document> {
    return this.http.post<Document>(this.apiUrl, data);
  }

  updateDocument(id: string, data: Partial<CreateDocument>): Observable<Document> {
    return this.http.put<Document>(`${this.apiUrl}/${id}`, data);
  }

  deleteDocument(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
