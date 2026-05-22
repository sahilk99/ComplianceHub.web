import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor() { }

  showSuccess(message: string): void {
    // Basic implementation since no toast library is specified
    alert(`SUCCESS: ${message}`);
  }

  showError(message: string): void {
    alert(`ERROR: ${message}`);
  }
}
