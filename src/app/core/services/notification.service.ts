import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, interval, switchMap, tap } from 'rxjs';

export interface AppNotification {
  id: number;
  message: string;
  documentId?: number;
  createdAt: string;
  isRead: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7123/api/notifications';

  private unreadCountSubject = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCountSubject.asObservable();

  constructor() {
    this.startPolling();
  }

  private startPolling(): void {
    // Initial fetch
    this.updateUnreadCount();

    // Poll every 60 seconds
    interval(60000).pipe(
      switchMap(() => this.getUnreadCount())
    ).subscribe({
      next: (res) => this.unreadCountSubject.next(res.count),
      error: (err) => console.error('Failed to poll notifications', err)
    });
  }

  updateUnreadCount(): void {
    this.getUnreadCount().subscribe({
      next: (res) => this.unreadCountSubject.next(res.count),
      error: (err) => console.error('Failed to fetch unread count', err)
    });
  }

  getNotifications(): Observable<AppNotification[]> {
    return this.http.get<AppNotification[]>(this.apiUrl);
  }

  getUnreadCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/count`);
  }

  markAsRead(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/read`, {}).pipe(
      tap(() => {
        const currentCount = this.unreadCountSubject.value;
        if (currentCount > 0) {
          this.unreadCountSubject.next(currentCount - 1);
        }
      })
    );
  }

  markAllAsRead(): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/mark-all-read`, {}).pipe(
      tap(() => {
        this.unreadCountSubject.next(0);
      })
    );
  }

  showSuccess(message: string): void {
    alert(`SUCCESS: ${message}`);
  }

  showError(message: string): void {
    alert(`ERROR: ${message}`);
  }
}
