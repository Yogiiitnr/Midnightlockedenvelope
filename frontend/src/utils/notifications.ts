/**
 * Browser Notification Manager
 * Provides native browser notifications for important events
 */

let notificationPermission: NotificationPermission = 'default';

/**
 * Initialize notifications by requesting permission
 */
export async function initializeNotifications() {
  if ('Notification' in window) {
    notificationPermission = await Notification.requestPermission();
    console.log('📢 Browser notifications:', notificationPermission);
  }
}

/**
 * Show a notification
 */
function showNotification(title: string, options?: NotificationOptions) {
  if ('Notification' in window && notificationPermission === 'granted') {
    new Notification(title, {
      icon: '/vite.svg',
      badge: '/vite.svg',
      ...options,
    });
  }
}

/**
 * Notification Manager API
 */
export const notificationManager = {
  /**
   * Notify envelope creation success
   */
  notifyEnvelopeCreated(txId: string) {
    showNotification('✨ Envelope Created!', {
      body: `Transaction ID: ${txId.substring(0, 20)}...`,
      tag: 'envelope-created',
    });
  },

  /**
   * Notify envelope claim success
   */
  notifyEnvelopeClaimed(txId: string) {
    showNotification('🎁 Envelope Claimed!', {
      body: `Transaction ID: ${txId.substring(0, 20)}...`,
      tag: 'envelope-claimed',
    });
  },

  /**
   * Notify generic success
   */
  notifySuccess(message: string) {
    showNotification('✅ Success', {
      body: message,
      tag: 'success',
    });
  },

  /**
   * Notify error
   */
  notifyError(message: string) {
    showNotification('❌ Error', {
      body: message,
      tag: 'error',
    });
  },

  /**
   * Notify warning
   */
  notifyWarning(message: string) {
    showNotification('⚠️ Warning', {
      body: message,
      tag: 'warning',
    });
  },

  /**
   * Notify pending operation
   */
  notifyPending(message: string) {
    showNotification('⏳ Processing', {
      body: message,
      tag: 'pending',
    });
  },
};
