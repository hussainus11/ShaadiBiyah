import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface Notification {
  id: string;
  userId: string;
  type: 'booking' | 'payment' | 'message' | 'system' | 'vendor_update' | 'match' | 'reminder';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
  removeNotification: (notificationId: string) => void;
  // Helper functions for common notification types
  addBookingNotification: (title: string, message: string, actionUrl?: string) => void;
  addPaymentNotification: (title: string, message: string, actionUrl?: string) => void;
  addMessageNotification: (title: string, message: string, actionUrl?: string) => void;
  addSystemNotification: (title: string, message: string, actionUrl?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Mock notifications for demo purposes
  useEffect(() => {
    if (user) {
      const baseNotifications: Notification[] = [
        {
          id: '1',
          userId: user.id,
          type: 'booking',
          title: 'Booking Confirmed',
          message: 'Your booking for Royal Palace Banquet has been confirmed for Dec 15, 2024',
          isRead: false,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          actionUrl: 'user-dashboard',
          priority: 'high'
        },
        {
          id: '2',
          userId: user.id,
          type: 'payment',
          title: 'Payment Received',
          message: 'Payment of Rs.15,000 has been received for your wedding photography booking',
          isRead: false,
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
          actionUrl: 'user-dashboard',
          priority: 'medium'
        },
        {
          id: '3',
          userId: user.id,
          type: 'message',
          title: 'New Message',
          message: 'You have received a new message from Rahul Photography',
          isRead: true,
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
          actionUrl: 'matrimonial',
          priority: 'medium'
        },
        {
          id: '4',
          userId: user.id,
          type: 'reminder',
          title: 'Wedding Reminder',
          message: 'Your wedding is in 30 days! Don\'t forget to finalize your vendors',
          isRead: false,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          actionUrl: 'user-dashboard',
          priority: 'high'
        },
        {
          id: '5',
          userId: user.id,
          type: 'vendor_update',
          title: 'Vendor Update',
          message: 'Mercedes Premium Cars has updated their availability for your wedding date',
          isRead: true,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          actionUrl: 'marketplace',
          priority: 'low'
        }
      ];

      // Add role-specific notifications
      const roleSpecificNotifications: Notification[] = [];
      
      if (user.role === 'vendor') {
        roleSpecificNotifications.push(
          {
            id: 'v1',
            userId: user.id,
            type: 'booking',
            title: 'New Booking Request',
            message: 'You have received a new booking request for Photography services',
            isRead: false,
            createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
            actionUrl: 'vendor-dashboard',
            priority: 'high'
          },
          {
            id: 'v2',
            userId: user.id,
            type: 'payment',
            title: 'Payment Processed',
            message: 'Payment of Rs.45,000 has been processed for your Photography service',
            isRead: false,
            createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
            actionUrl: 'vendor-dashboard',
            priority: 'high'
          },
          {
            id: 'v3',
            userId: user.id,
            type: 'system',
            title: 'Profile Update Required',
            message: 'Please update your business information to maintain your profile',
            isRead: true,
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
            actionUrl: 'vendor-dashboard',
            priority: 'medium'
          }
        );
      } else if (user.role === 'admin') {
        roleSpecificNotifications.push(
          {
            id: 'a1',
            userId: user.id,
            type: 'vendor_update',
            title: 'Vendor Approval Required',
            message: '3 new vendors are waiting for approval',
            isRead: false,
            createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
            actionUrl: 'admin-panel',
            priority: 'high'
          },
          {
            id: 'a2',
            userId: user.id,
            type: 'payment',
            title: 'Payment Dispute',
            message: 'A payment dispute has been reported for booking #BK001234',
            isRead: false,
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
            actionUrl: 'admin-panel',
            priority: 'high'
          },
          {
            id: 'a3',
            userId: user.id,
            type: 'system',
            title: 'System Maintenance',
            message: 'Scheduled maintenance will occur tonight at 2 AM',
            isRead: true,
            createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
            actionUrl: 'admin-panel',
            priority: 'medium'
          }
        );
      }

      // Combine base and role-specific notifications
      const allNotifications = [...baseNotifications, ...roleSpecificNotifications];
      
      // Filter notifications for current user
      const userNotifications = allNotifications.filter(notif => notif.userId === user.id);
      setNotifications(userNotifications);
    } else {
      setNotifications([]);
    }
  }, [user]);

  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}`,
      createdAt: new Date().toISOString(),
      isRead: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const removeNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  // Helper functions for common notification types
  const addBookingNotification = (title: string, message: string, actionUrl?: string) => {
    addNotification({
      userId: user?.id || '',
      type: 'booking',
      title,
      message,
      actionUrl,
      priority: 'high'
    });
  };

  const addPaymentNotification = (title: string, message: string, actionUrl?: string) => {
    addNotification({
      userId: user?.id || '',
      type: 'payment',
      title,
      message,
      actionUrl,
      priority: 'high'
    });
  };

  const addMessageNotification = (title: string, message: string, actionUrl?: string) => {
    addNotification({
      userId: user?.id || '',
      type: 'message',
      title,
      message,
      actionUrl,
      priority: 'medium'
    });
  };

  const addSystemNotification = (title: string, message: string, actionUrl?: string) => {
    addNotification({
      userId: user?.id || '',
      type: 'system',
      title,
      message,
      actionUrl,
      priority: 'medium'
    });
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      addNotification,
      removeNotification,
      addBookingNotification,
      addPaymentNotification,
      addMessageNotification,
      addSystemNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
