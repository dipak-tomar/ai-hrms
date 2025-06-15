import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  timestamp: Date;
  metadata?: any;
}

export interface DashboardUpdate {
  type: string;
  action?: string;
  data: any;
  timestamp: Date;
}

export interface AttendanceUpdate {
  employeeId: string;
  action: 'CLOCK_IN' | 'CLOCK_OUT' | 'BREAK_START' | 'BREAK_END';
  data: any;
  timestamp: Date;
}

export interface LeaveStatusUpdate {
  leaveId: string;
  employeeId: string;
  status: 'APPROVED' | 'REJECTED';
  approvedBy: string;
  timestamp: Date;
}

export interface SupportMessage {
  id: string;
  userId: string;
  message: string;
  timestamp: Date;
  type: string;
}

export interface EmergencyAlert {
  id: string;
  title: string;
  message: string;
  type: 'EMERGENCY';
  priority: 'CRITICAL';
  timestamp: Date;
  actionRequired?: boolean;
  evacuationRequired?: boolean;
}

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnecting = false;

  // Event listeners
  private notificationListeners: ((notification: Notification) => void)[] = [];
  private dashboardUpdateListeners: ((update: DashboardUpdate) => void)[] = [];
  private attendanceUpdateListeners: ((update: AttendanceUpdate) => void)[] = [];
  private leaveUpdateListeners: ((update: LeaveStatusUpdate) => void)[] = [];
  private supportMessageListeners: ((message: SupportMessage) => void)[] = [];
  private emergencyAlertListeners: ((alert: EmergencyAlert) => void)[] = [];
  private connectionStatusListeners: ((connected: boolean) => void)[] = [];
  private typingListeners: ((data: { userId: string; timestamp: Date }) => void)[] = [];

  connect() {
    if (this.socket?.connected || this.isConnecting) {
      return;
    }

    const token = useAuthStore.getState().token;
    if (!token) {
      console.warn('No auth token available for socket connection');
      return;
    }

    this.isConnecting = true;

    try {
      this.socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3001', {
        auth: {
          token: token
        },
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: true
      });

      this.setupEventListeners();
    } catch (error) {
      console.error('Failed to create socket connection:', error);
      this.isConnecting = false;
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      this.notifyConnectionStatus(true);
      
      // Subscribe to dashboard updates by default
      this.subscribeToDashboard();
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      this.notifyConnectionStatus(false);
      
      // Attempt to reconnect if disconnection was not intentional
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, don't reconnect automatically
        return;
      }
      
      this.attemptReconnect();
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.isConnecting = false;
      this.attemptReconnect();
    });

    // Real-time notifications
    this.socket.on('new-notification', (notification: Notification) => {
      this.handleNewNotification(notification);
    });

    this.socket.on('notification-updated', (data: { notificationId: string; status: string }) => {
      console.log('Notification updated:', data);
    });

    // Dashboard updates
    this.socket.on('dashboard-update', (update: DashboardUpdate) => {
      this.notifyDashboardUpdate(update);
    });

    // Analytics updates
    this.socket.on('analytics-update', (data: { type: string; data: any; timestamp: Date }) => {
      this.notifyDashboardUpdate({
        type: 'analytics',
        action: data.type,
        data: data.data,
        timestamp: data.timestamp
      });
    });

    // Attendance updates
    this.socket.on('attendance-update', (update: AttendanceUpdate) => {
      this.notifyAttendanceUpdate(update);
    });

    // Leave updates
    this.socket.on('leave-status-changed', (update: LeaveStatusUpdate) => {
      this.notifyLeaveUpdate(update);
    });

    // Support chat
    this.socket.on('support-message', (message: SupportMessage) => {
      this.notifySupportMessage(message);
    });

    this.socket.on('user-typing', (data: { userId: string; timestamp: Date }) => {
      this.notifyTyping(data);
    });

    this.socket.on('user-stopped-typing', (data: { userId: string; timestamp: Date }) => {
      // Handle typing stopped
    });

    // System announcements
    this.socket.on('system-announcement', (announcement: Notification) => {
      this.handleSystemAnnouncement(announcement);
    });

    // Emergency alerts
    this.socket.on('emergency-alert', (alert: EmergencyAlert) => {
      this.handleEmergencyAlert(alert);
    });

    // User status updates
    this.socket.on('user-online', (data: { userId: string; timestamp: Date; totalOnline: number }) => {
      console.log('User came online:', data);
    });

    this.socket.on('user-offline', (data: { userId: string; timestamp: Date; totalOnline: number }) => {
      console.log('User went offline:', data);
    });

    // Connection confirmation
    this.socket.on('connected', (data: { userId: string; timestamp: Date; onlineUsers: number }) => {
      console.log('Connection confirmed:', data);
    });

    // Error handling
    this.socket.on('error', (error: any) => {
      console.error('Socket error:', error);
      toast.error('Real-time connection error: ' + error.message);
    });
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      toast.error('Lost connection to server. Please refresh the page.');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1); // Exponential backoff

    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`);

    setTimeout(() => {
      if (!this.socket?.connected) {
        this.connect();
      }
    }, delay);
  }

  private handleNewNotification(notification: Notification) {
    // Show toast notification
    const toastOptions = {
      duration: notification.priority === 'CRITICAL' ? 10000 : 5000,
      position: 'top-right' as const
    };

    switch (notification.priority) {
      case 'CRITICAL':
        toast.error(`${notification.title}: ${notification.message}`, toastOptions);
        break;
      case 'HIGH':
        toast.error(`${notification.title}: ${notification.message}`, toastOptions);
        break;
      case 'MEDIUM':
        toast(`${notification.title}: ${notification.message}`, toastOptions);
        break;
      case 'LOW':
        toast.success(`${notification.title}: ${notification.message}`, toastOptions);
        break;
      default:
        toast(`${notification.title}: ${notification.message}`, toastOptions);
    }

    // Notify listeners
    this.notificationListeners.forEach(listener => listener(notification));
  }

  private handleSystemAnnouncement(announcement: Notification) {
    toast(`📢 ${announcement.title}: ${announcement.message}`, {
      duration: 8000,
      position: 'top-center'
    });

    this.notificationListeners.forEach(listener => listener(announcement));
  }

  private handleEmergencyAlert(alert: EmergencyAlert) {
    // Show critical alert
    toast.error(`🚨 EMERGENCY: ${alert.title} - ${alert.message}`, {
      duration: 15000,
      position: 'top-center'
    });

    // Play alert sound if possible
    try {
      const audio = new Audio('/alert-sound.mp3');
      audio.play().catch(() => {
        // Ignore if audio can't be played
      });
    } catch (error) {
      // Ignore audio errors
    }

    this.emergencyAlertListeners.forEach(listener => listener(alert));
  }

  // Public methods for subscribing to events
  onNotification(callback: (notification: Notification) => void) {
    this.notificationListeners.push(callback);
    return () => {
      this.notificationListeners = this.notificationListeners.filter(l => l !== callback);
    };
  }

  onDashboardUpdate(callback: (update: DashboardUpdate) => void) {
    this.dashboardUpdateListeners.push(callback);
    return () => {
      this.dashboardUpdateListeners = this.dashboardUpdateListeners.filter(l => l !== callback);
    };
  }

  onAttendanceUpdate(callback: (update: AttendanceUpdate) => void) {
    this.attendanceUpdateListeners.push(callback);
    return () => {
      this.attendanceUpdateListeners = this.attendanceUpdateListeners.filter(l => l !== callback);
    };
  }

  onLeaveUpdate(callback: (update: LeaveStatusUpdate) => void) {
    this.leaveUpdateListeners.push(callback);
    return () => {
      this.leaveUpdateListeners = this.leaveUpdateListeners.filter(l => l !== callback);
    };
  }

  onSupportMessage(callback: (message: SupportMessage) => void) {
    this.supportMessageListeners.push(callback);
    return () => {
      this.supportMessageListeners = this.supportMessageListeners.filter(l => l !== callback);
    };
  }

  onEmergencyAlert(callback: (alert: EmergencyAlert) => void) {
    this.emergencyAlertListeners.push(callback);
    return () => {
      this.emergencyAlertListeners = this.emergencyAlertListeners.filter(l => l !== callback);
    };
  }

  onConnectionStatus(callback: (connected: boolean) => void) {
    this.connectionStatusListeners.push(callback);
    return () => {
      this.connectionStatusListeners = this.connectionStatusListeners.filter(l => l !== callback);
    };
  }

  onTyping(callback: (data: { userId: string; timestamp: Date }) => void) {
    this.typingListeners.push(callback);
    return () => {
      this.typingListeners = this.typingListeners.filter(l => l !== callback);
    };
  }

  // Notification methods
  private notifyDashboardUpdate(update: DashboardUpdate) {
    this.dashboardUpdateListeners.forEach(listener => listener(update));
  }

  private notifyAttendanceUpdate(update: AttendanceUpdate) {
    this.attendanceUpdateListeners.forEach(listener => listener(update));
  }

  private notifyLeaveUpdate(update: LeaveStatusUpdate) {
    this.leaveUpdateListeners.forEach(listener => listener(update));
  }

  private notifySupportMessage(message: SupportMessage) {
    this.supportMessageListeners.forEach(listener => listener(message));
  }

  private notifyConnectionStatus(connected: boolean) {
    this.connectionStatusListeners.forEach(listener => listener(connected));
  }

  private notifyTyping(data: { userId: string; timestamp: Date }) {
    this.typingListeners.forEach(listener => listener(data));
  }

  // Action methods
  subscribeToDashboard() {
    this.socket?.emit('subscribe-dashboard');
  }

  unsubscribeFromDashboard() {
    this.socket?.emit('unsubscribe-dashboard');
  }

  subscribeToLeaveUpdates() {
    this.socket?.emit('subscribe-leave-updates');
  }

  subscribeToAttendanceUpdates() {
    this.socket?.emit('subscribe-attendance-updates');
  }

  markNotificationAsRead(notificationId: string) {
    this.socket?.emit('mark-notification-read', notificationId);
  }

  // Support chat methods
  joinSupportChat() {
    this.socket?.emit('join-support-chat');
  }

  sendSupportMessage(message: string, urgent = false) {
    this.socket?.emit('support-message', {
      message,
      urgent,
      type: 'text'
    });
  }

  startTyping() {
    this.socket?.emit('typing-start');
  }

  stopTyping() {
    this.socket?.emit('typing-stop');
  }

  // Connection management
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnecting = false;
    this.reconnectAttempts = 0;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Get connection stats
  getConnectionInfo() {
    return {
      connected: this.isConnected(),
      reconnectAttempts: this.reconnectAttempts,
      socketId: this.socket?.id
    };
  }
}

// Create singleton instance
export const socketService = new SocketService();

export default socketService; 