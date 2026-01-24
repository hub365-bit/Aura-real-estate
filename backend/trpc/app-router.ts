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
import { sendMessageProcedure } from "./routes/messages/send";

import { calculateTrustScoreProcedure } from "./routes/trust/calculate-score";
import { updateTrustScoreProcedure } from "./routes/trust/update-score";

import { createConversationProcedure } from "./routes/conversations/create";
import { listConversationsProcedure } from "./routes/conversations/list";

import { holdPaymentProcedure } from "./routes/escrow/hold-payment";
import { releasePaymentProcedure } from "./routes/escrow/release-payment";
import { disputeEscrowProcedure } from "./routes/escrow/dispute";

import { createAgreementProcedure } from "./routes/agreements/create";
import { signAgreementProcedure } from "./routes/agreements/sign";

import { listDevicesProcedure } from "./routes/devices/list";
import { trustDeviceProcedure } from "./routes/devices/trust";

import { getPriceIntelligenceProcedure } from "./routes/ai/price-intelligence";
import { calculateQualityScoreProcedure } from "./routes/quality/calculate-score";
import { getNeighborhoodInfoProcedure } from "./routes/neighborhood/get-info";

import { createInvoiceProcedure } from "./routes/invoices/create";
import { listInvoicesProcedure } from "./routes/invoices/list";
import { payInvoiceProcedure } from "./routes/invoices/pay";

import { createEventProcedure } from "./routes/events/create";
import { listEventsProcedure } from "./routes/events/list";
import { bookEventTicketProcedure } from "./routes/events/book-ticket";

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
    send: sendMessageProcedure,
  }),
  
  trust: createTRPCRouter({
    calculateScore: calculateTrustScoreProcedure,
    updateScore: updateTrustScoreProcedure,
  }),
  
  conversations: createTRPCRouter({
    create: createConversationProcedure,
    list: listConversationsProcedure,
  }),
  
  escrow: createTRPCRouter({
    holdPayment: holdPaymentProcedure,
    releasePayment: releasePaymentProcedure,
    dispute: disputeEscrowProcedure,
  }),
  
  agreements: createTRPCRouter({
    create: createAgreementProcedure,
    sign: signAgreementProcedure,
  }),
  
  devices: createTRPCRouter({
    list: listDevicesProcedure,
    trust: trustDeviceProcedure,
  }),
  
  ai: createTRPCRouter({
    priceIntelligence: getPriceIntelligenceProcedure,
  }),
  
  quality: createTRPCRouter({
    calculateScore: calculateQualityScoreProcedure,
  }),
  
  neighborhood: createTRPCRouter({
    getInfo: getNeighborhoodInfoProcedure,
  }),
  
  invoices: createTRPCRouter({
    create: createInvoiceProcedure,
    list: listInvoicesProcedure,
    pay: payInvoiceProcedure,
  }),
  
  events: createTRPCRouter({
    create: createEventProcedure,
    list: listEventsProcedure,
    bookTicket: bookEventTicketProcedure,
  }),
});

export type AppRouter = typeof appRouter;
