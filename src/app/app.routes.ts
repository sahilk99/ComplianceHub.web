import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { AppLayoutComponent } from './core/layout/app-layout/app-layout';
import { DashboardComponent } from './features/dashboard/dashboard';
import { DocumentsComponent } from './features/documents/documents';
import { AuditLogsComponent } from './features/audit-logs/audit-logs';
import { UnauthorizedComponent } from './features/auth/unauthorized/unauthorized';
import { authGuard } from './core/guards/auth.guard';
// Note: Assuming RoleGuard exists or is similar, if not we just use authGuard.
// From user prompt: "AuthGuard and RoleGuard exist as functional guards"
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'documents', component: DocumentsComponent },
      { 
        path: 'documents/new', 
        component: DocumentsComponent, // Placeholder mapping
        canActivate: [roleGuard],
        data: { roles: ['Admin'] }
      },
      { 
        path: 'audit-logs', 
        component: AuditLogsComponent,
        canActivate: [roleGuard],
        data: { roles: ['Admin', 'Auditor'] }
      }
    ]
  },
  
  { path: '**', redirectTo: 'dashboard' }
];
