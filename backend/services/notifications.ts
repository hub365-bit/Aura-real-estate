export interface PushNotification {
  userId: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

export interface EmailNotification {
  to: string;
  subject: string;
  body: string;
  html?: string;
}

export async function sendPushNotification(notification: PushNotification): Promise<void> {
  console.log("📱 Sending push notification:", notification);
  
  if (process.env.NODE_ENV === "production") {
    console.warn("⚠️  Implement real push notification service (FCM)");
    console.warn("Required env vars: FCM_SERVER_KEY or FIREBASE_SERVICE_ACCOUNT");
  }
}

export async function sendEmail(email: EmailNotification): Promise<void> {
  console.log("📧 Sending email:", email);
  
  if (process.env.NODE_ENV === "production") {
    console.warn("⚠️  Implement real email service (SendGrid/Resend/SMTP)");
    console.warn("Required env vars: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS");
  }
}

export async function sendSMS(phoneNumber: string, message: string): Promise<void> {
  console.log("💬 Sending SMS:", { phoneNumber, message });
  
  if (process.env.NODE_ENV === "production") {
    console.warn("⚠️  Implement real SMS service (Twilio/Africa's Talking)");
    console.warn("Required env vars: SMS_API_KEY, SMS_SENDER_ID");
  }
}

export async function sendBulkNotifications(
  userIds: string[],
  notification: Omit<PushNotification, "userId">
): Promise<void> {
  console.log(`📢 Sending bulk notifications to ${userIds.length} users`);
  
  await Promise.all(
    userIds.map((userId) =>
      sendPushNotification({
        userId,
        ...notification,
      })
    )
  );
}
