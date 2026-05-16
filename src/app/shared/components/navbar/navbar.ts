import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Notification {
  id: number;
  message: string;
  timeAgo: string;
  isRead: boolean;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class NavbarComponent {
  @Input() pageTitle: string = 'Dashboard';

  isNotificationOpen = false;
  
  notifications: Notification[] = [
    { id: 1, message: 'New audit assigned to you.', timeAgo: '5 mins ago', isRead: false },
    { id: 2, message: 'Document "Q1 Report" was approved.', timeAgo: '2 hours ago', isRead: false },
    { id: 3, message: 'System maintenance scheduled.', timeAgo: '1 day ago', isRead: true }
  ];

  get unreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  toggleNotifications(): void {
    this.isNotificationOpen = !this.isNotificationOpen;
  }

  markAllAsRead(): void {
    this.notifications = this.notifications.map(n => ({ ...n, isRead: true }));
    this.isNotificationOpen = false;
  }
}
