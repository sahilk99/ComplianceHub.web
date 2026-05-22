import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { AppLayoutComponent } from './core/layout/app-layout/app-layout';
import { DashboardComponent } from './features/dashboard/dashboard';
import { DocumentList } from './features/documents/document-list/document-list';
import { DocumentDetail } from './features/documents/document-detail/document-detail';
import { DocumentForm } from './features/documents/document-form/document-form';
import { AuditLogsComponent } from './features/audit-logs/audit-logs';
import { UnauthorizedComponent } from './features/auth/unauthorized/unauthorized';
import { authGuard } from './core/guards/auth.guard';
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
      { path: 'documents', component: DocumentList },
      { 
        path: 'documents/new', 
        component: DocumentForm,
        canActivate: [roleGuard],
        data: { roles: ['Admin'] }
      },
      { 
        path: 'documents/:id', 
        component: DocumentDetail 
      },
      { 
        path: 'documents/:id/edit', 
        component: DocumentForm,
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
