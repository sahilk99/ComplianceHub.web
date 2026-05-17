import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private jwtHelper = new JwtHelperService();
  private readonly TOKEN_KEY = 'compliance_token';
  private apiUrl = 'https://localhost:7123/api/auth';

  private currentUserSubject = new BehaviorSubject<User | null>(this.getCurrentUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        if (response && response.token) {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(this.TOKEN_KEY, response.token);
          }
          this.currentUserSubject.next(this.getCurrentUser());
        }
      })
    );
  }

  register(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, data);
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
    }
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const decoded = this.jwtHelper.decodeToken(token);
      return {
        id: decoded.nameid || decoded.userId || decoded.sub,
        name: decoded.unique_name || decoded.name,
        email: decoded.email,
        role: decoded.role,
        departmentId: decoded.departmentId,
        token: token,
        expiryAt: decoded.exp
      };
    }
    return null;
  }

  isLoggedIn(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }
    const token = localStorage.getItem(this.TOKEN_KEY);
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }

  getUserRole(): string {
    const user = this.getCurrentUser();
    return user ? user.role : '';
  }
}
