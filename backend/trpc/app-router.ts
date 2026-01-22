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

import { calculateTrustScoreProcedure } from "./routes/trust/calculate";
import { getTrustScoreProcedure } from "./routes/trust/get";

import { listConversationsProcedure } from "./routes/conversations/list";
import { sendMessageProcedure } from "./routes/conversations/send-message";
import { getMessagesProcedure } from "./routes/conversations/get-messages";

import { createEscrowProcedure } from "./routes/escrow/create";
import { releaseEscrowProcedure } from "./routes/escrow/release";
import { disputeEscrowProcedure } from "./routes/escrow/dispute";
import { listEscrowProcedure } from "./routes/escrow/list";

import { createAgreementProcedure } from "./routes/agreements/create";
import { signAgreementProcedure } from "./routes/agreements/sign";
import { listAgreementsProcedure } from "./routes/agreements/list";

import { listDevicesProcedure } from "./routes/devices/list";
import { addDeviceProcedure } from "./routes/devices/add";
import { removeDeviceProcedure } from "./routes/devices/remove";

import { getAIPricingProcedure } from "./routes/ai/pricing";
import { getBestPostingTimeProcedure } from "./routes/ai/best-posting-time";

import { calculateQualityScoreProcedure } from "./routes/quality/calculate";

import { getNeighborhoodDataProcedure } from "./routes/neighborhood/get";

import { generateInvoiceProcedure } from "./routes/billing/generate-invoice";
import { listInvoicesProcedure } from "./routes/billing/list-invoices";

import { getTenantProfileProcedure } from "./routes/tenants/get-profile";

import { createEventProcedure } from "./routes/events/create";
import { listEventsProcedure } from "./routes/events/list";
import { purchaseTicketProcedure } from "./routes/events/purchase-ticket";

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
  
  trust: createTRPCRouter({
    calculate: calculateTrustScoreProcedure,
    get: getTrustScoreProcedure,
  }),
  
  conversations: createTRPCRouter({
    list: listConversationsProcedure,
    sendMessage: sendMessageProcedure,
    getMessages: getMessagesProcedure,
  }),
  
  escrow: createTRPCRouter({
    create: createEscrowProcedure,
    release: releaseEscrowProcedure,
    dispute: disputeEscrowProcedure,
    list: listEscrowProcedure,
  }),
  
  agreements: createTRPCRouter({
    create: createAgreementProcedure,
    sign: signAgreementProcedure,
    list: listAgreementsProcedure,
  }),
  
  devices: createTRPCRouter({
    list: listDevicesProcedure,
    add: addDeviceProcedure,
    remove: removeDeviceProcedure,
  }),
  
  ai: createTRPCRouter({
    pricing: getAIPricingProcedure,
    bestPostingTime: getBestPostingTimeProcedure,
  }),
  
  quality: createTRPCRouter({
    calculate: calculateQualityScoreProcedure,
  }),
  
  neighborhood: createTRPCRouter({
    get: getNeighborhoodDataProcedure,
  }),
  
  billing: createTRPCRouter({
    generateInvoice: generateInvoiceProcedure,
    listInvoices: listInvoicesProcedure,
  }),
  
  tenants: createTRPCRouter({
    getProfile: getTenantProfileProcedure,
  }),
  
  events: createTRPCRouter({
    create: createEventProcedure,
    list: listEventsProcedure,
    purchaseTicket: purchaseTicketProcedure,
  }),
});

export type AppRouter = typeof appRouter;
