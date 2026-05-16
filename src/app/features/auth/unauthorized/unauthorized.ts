import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div style="text-align: center; padding: 4rem;">
      <h2 style="color: #e53e3e; font-size: 2rem;">Unauthorized Access</h2>
      <p style="color: #4a5568;">You do not have permission to view this page.</p>
      <a routerLink="/dashboard" style="color: #3182ce; text-decoration: none;">Return to Dashboard</a>
    </div>
  `,
})
export class UnauthorizedComponent {}
