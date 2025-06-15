import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  isRead: boolean;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface NotificationStats {
  totalNotifications: number;
  unreadNotifications: number;
  todayNotifications: number;
  weekNotifications: number;
  notificationsByType: Array<{
    type: string;
    count: number;
  }>;
}

export interface PaginatedNotifications {
  notifications: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface SystemAnnouncement {
  title: string;
  message: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  targetRoles?: string[];
  targetUsers?: string[];
}

export interface EmergencyAlert {
  title: string;
  message: string;
  actionRequired?: boolean;
  evacuationRequired?: boolean;
}

class NotificationService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  // Get user notifications with pagination and filtering
  async getNotifications(params?: {
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
    type?: string;
  }): Promise<PaginatedNotifications> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.unreadOnly) queryParams.append('unreadOnly', params.unreadOnly.toString());
    if (params?.type) queryParams.append('type', params.type);

    const response = await axios.get(
      `${API_BASE_URL}/api/notifications?${queryParams.toString()}`,
      { headers: this.getAuthHeaders() }
    );

    return response.data;
  }

  // Get unread notifications count
  async getUnreadCount(): Promise<{ count: number }> {
    const response = await axios.get(
      `${API_BASE_URL}/api/notifications/unread-count`,
      { headers: this.getAuthHeaders() }
    );

    return response.data;
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<{ message: string; notification: Notification }> {
    const response = await axios.patch(
      `${API_BASE_URL}/api/notifications/${notificationId}/read`,
      {},
      { headers: this.getAuthHeaders() }
    );

    return response.data;
  }

  // Mark all notifications as read
  async markAllAsRead(): Promise<{ message: string; updatedCount: number }> {
    const response = await axios.patch(
      `${API_BASE_URL}/api/notifications/mark-all-read`,
      {},
      { headers: this.getAuthHeaders() }
    );

    return response.data;
  }

  // Delete notification
  async deleteNotification(notificationId: string): Promise<{ message: string }> {
    const response = await axios.delete(
      `${API_BASE_URL}/api/notifications/${notificationId}`,
      { headers: this.getAuthHeaders() }
    );

    return response.data;
  }

  // Create system announcement (Admin/HR only)
  async createSystemAnnouncement(announcement: SystemAnnouncement): Promise<{ message: string; announcement: SystemAnnouncement & { createdBy: string; createdAt: Date } }> {
    const response = await axios.post(
      `${API_BASE_URL}/api/notifications/system-announcement`,
      announcement,
      { headers: this.getAuthHeaders() }
    );

    return response.data;
  }

  // Send emergency alert (Admin only)
  async sendEmergencyAlert(alert: EmergencyAlert): Promise<{ message: string; alert: EmergencyAlert & { createdBy: string; createdAt: Date } }> {
    const response = await axios.post(
      `${API_BASE_URL}/api/notifications/emergency-alert`,
      alert,
      { headers: this.getAuthHeaders() }
    );

    return response.data;
  }

  // Get notification statistics (for admins)
  async getNotificationStats(): Promise<NotificationStats> {
    const response = await axios.get(
      `${API_BASE_URL}/api/notifications/stats`,
      { headers: this.getAuthHeaders() }
    );

    return response.data;
  }
}

export const notificationService = new NotificationService();
export default notificationService; 