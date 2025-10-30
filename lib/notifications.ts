import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export type NotificationType = 
  | 'booking_confirmed'
  | 'booking_cancelled'
  | 'payment_reminder'
  | 'ticket_update'
  | 'reward_earned'
  | 'boost_expiry'
  | 'rent_reminder'
  | 'subscription_expiry'
  | 'new_message'
  | 'listing_approved'
  | 'document_verified';

export interface NotificationPayload {
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
}

export async function registerForPushNotificationsAsync(): Promise<string | undefined> {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.warn('Failed to get push token for push notification!');
      return;
    }
    
    try {
      const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
      if (!projectId) {
        throw new Error('Project ID not found');
      }
      
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      
      console.log('Push notification token:', token);
    } catch (e) {
      console.error('Error getting push token:', e);
    }
  } else {
    console.warn('Must use physical device for Push Notifications');
  }

  return token;
}

export async function schedulePushNotification(
  notification: NotificationPayload,
  trigger?: Notifications.NotificationTriggerInput
): Promise<string> {
  return await Notifications.scheduleNotificationAsync({
    content: {
      title: notification.title,
      body: notification.body,
      data: {
        type: notification.type,
        ...notification.data,
      },
      sound: true,
    },
    trigger: trigger || null,
  });
}

export async function sendImmediateNotification(
  notification: NotificationPayload
): Promise<string> {
  return await schedulePushNotification(notification);
}

export async function scheduleRentReminder(
  tenantName: string,
  amount: number,
  dueDate: Date
): Promise<string> {
  const threeDaysBefore = new Date(dueDate);
  threeDaysBefore.setDate(threeDaysBefore.getDate() - 3);

  return await schedulePushNotification(
    {
      type: 'rent_reminder',
      title: 'Rent Payment Due Soon',
      body: `Hi ${tenantName}, your rent of KSh ${amount.toLocaleString()} is due on ${dueDate.toLocaleDateString()}`,
      data: { amount, dueDate: dueDate.toISOString() },
    },
    { date: threeDaysBefore } as Notifications.DateTriggerInput
  );
}

export async function scheduleSubscriptionExpiryReminder(
  subscriptionType: string,
  expiryDate: Date
): Promise<string> {
  const twoDaysBefore = new Date(expiryDate);
  twoDaysBefore.setDate(twoDaysBefore.getDate() - 2);

  return await schedulePushNotification(
    {
      type: 'subscription_expiry',
      title: 'Subscription Expiring Soon',
      body: `Your ${subscriptionType} subscription expires on ${expiryDate.toLocaleDateString()}. Renew to continue enjoying premium features.`,
      data: { subscriptionType, expiryDate: expiryDate.toISOString() },
    },
    { date: twoDaysBefore } as Notifications.DateTriggerInput
  );
}

export async function notifyBookingConfirmed(
  propertyName: string,
  bookingId: string,
  checkInDate: Date
): Promise<void> {
  await sendImmediateNotification({
    type: 'booking_confirmed',
    title: 'Booking Confirmed!',
    body: `Your booking for ${propertyName} has been confirmed. Check-in: ${checkInDate.toLocaleDateString()}`,
    data: { bookingId, propertyName },
  });
}

export async function notifyTicketUpdate(
  ticketId: string,
  status: string,
  message: string
): Promise<void> {
  await sendImmediateNotification({
    type: 'ticket_update',
    title: 'Ticket Update',
    body: message,
    data: { ticketId, status },
  });
}

export async function notifyRewardEarned(
  points: number,
  action: string
): Promise<void> {
  await sendImmediateNotification({
    type: 'reward_earned',
    title: 'Reward Points Earned!',
    body: `You earned ${points} points for ${action}. Total balance updated!`,
    data: { points, action },
  });
}

export async function notifyNewMessage(
  senderName: string,
  preview: string
): Promise<void> {
  await sendImmediateNotification({
    type: 'new_message',
    title: `New message from ${senderName}`,
    body: preview,
    data: { senderName },
  });
}

export async function cancelAllScheduledNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function cancelNotification(notificationId: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

export function addNotificationReceivedListener(
  listener: (notification: Notifications.Notification) => void
): Notifications.Subscription {
  return Notifications.addNotificationReceivedListener(listener);
}

export function addNotificationResponseReceivedListener(
  listener: (response: Notifications.NotificationResponse) => void
): Notifications.Subscription {
  return Notifications.addNotificationResponseReceivedListener(listener);
}
