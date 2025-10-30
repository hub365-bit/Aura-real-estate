import { createTRPCRouter } from "./create-context";

import { loginProcedure } from "./routes/auth/login";
import { signupProcedure } from "./routes/auth/signup";
import { verifyOtpProcedure } from "./routes/auth/verify-otp";
import { enable2faProcedure } from "./routes/auth/enable-2fa";

import { listPropertiesProcedure } from "./routes/properties/list";
import { getPropertyProcedure } from "./routes/properties/get";
import { createPropertyProcedure } from "./routes/properties/create";
import { updatePropertyProcedure } from "./routes/properties/update";
import { boostPropertyProcedure } from "./routes/properties/boost";

import { createBookingProcedure } from "./routes/bookings/create";
import { listBookingsProcedure } from "./routes/bookings/list";
import { getBookingProcedure } from "./routes/bookings/get";

import { createTicketProcedure } from "./routes/tickets/create";
import { listTicketsProcedure } from "./routes/tickets/list";
import { updateTicketProcedure } from "./routes/tickets/update";

import { getAnalyticsDashboardProcedure } from "./routes/analytics/dashboard";

import { getRewardsProcedure } from "./routes/rewards/get";
import { addRewardPointsProcedure } from "./routes/rewards/add";

import { listNotificationsProcedure } from "./routes/notifications/list";
import { markNotificationReadProcedure } from "./routes/notifications/mark-read";

import { createSubscriptionProcedure } from "./routes/subscriptions/create";
import { listSubscriptionsProcedure } from "./routes/subscriptions/list";

import { createReviewProcedure } from "./routes/reviews/create";
import { listReviewsProcedure } from "./routes/reviews/list";

import { createPostProcedure } from "./routes/posts/create";
import { listPostsProcedure } from "./routes/posts/list";

import { createBusinessProcedure } from "./routes/businesses/create";
import { listBusinessesProcedure } from "./routes/businesses/list";
import { getBusinessProcedure } from "./routes/businesses/get";

import { createPaymentProcedure } from "./routes/payments/create";
import { listPaymentsProcedure } from "./routes/payments/list";

import { createMessageProcedure } from "./routes/messages/create";
import { listMessagesProcedure } from "./routes/messages/list";

export const appRouter = createTRPCRouter({
  auth: createTRPCRouter({
    login: loginProcedure,
    signup: signupProcedure,
    verifyOtp: verifyOtpProcedure,
    enable2fa: enable2faProcedure,
  }),
  
  properties: createTRPCRouter({
    list: listPropertiesProcedure,
    get: getPropertyProcedure,
    create: createPropertyProcedure,
    update: updatePropertyProcedure,
    boost: boostPropertyProcedure,
  }),
  
  bookings: createTRPCRouter({
    create: createBookingProcedure,
    list: listBookingsProcedure,
    get: getBookingProcedure,
  }),
  
  tickets: createTRPCRouter({
    create: createTicketProcedure,
    list: listTicketsProcedure,
    update: updateTicketProcedure,
  }),
  
  analytics: createTRPCRouter({
    dashboard: getAnalyticsDashboardProcedure,
  }),
  
  rewards: createTRPCRouter({
    get: getRewardsProcedure,
    addPoints: addRewardPointsProcedure,
  }),
  
  notifications: createTRPCRouter({
    list: listNotificationsProcedure,
    markRead: markNotificationReadProcedure,
  }),
  
  subscriptions: createTRPCRouter({
    create: createSubscriptionProcedure,
    list: listSubscriptionsProcedure,
  }),
  
  reviews: createTRPCRouter({
    create: createReviewProcedure,
    list: listReviewsProcedure,
  }),
  
  posts: createTRPCRouter({
    create: createPostProcedure,
    list: listPostsProcedure,
  }),
  
  businesses: createTRPCRouter({
    create: createBusinessProcedure,
    list: listBusinessesProcedure,
    get: getBusinessProcedure,
  }),
  
  payments: createTRPCRouter({
    create: createPaymentProcedure,
    list: listPaymentsProcedure,
  }),
  
  messages: createTRPCRouter({
    create: createMessageProcedure,
    list: listMessagesProcedure,
  }),
});

export type AppRouter = typeof appRouter;
