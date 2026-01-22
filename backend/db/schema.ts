import { z } from "zod";

export const userRoleSchema = z.enum(["user", "agent", "landlord", "service_provider", "admin"]);
export const propertyTypeSchema = z.enum(["rental", "sale", "hospitality", "service"]);
export const ticketTypeSchema = z.enum(["repair", "vacate", "complaint", "other"]);
export const ticketStatusSchema = z.enum(["open", "claimed", "in_progress", "resolved", "closed"]);
export const bookingStatusSchema = z.enum(["pending", "confirmed", "checked_in", "checked_out", "cancelled"]);
export const subscriptionTierSchema = z.enum(["free", "weekly", "monthly", "yearly"]);
export const notificationTypeSchema = z.enum(["booking", "payment", "ticket", "reward", "boost", "general"]);
export const trustLevelSchema = z.enum(["verified", "building", "restricted"]);
export const escrowStatusSchema = z.enum(["held", "released", "refunded", "disputed"]);
export const messageTypeSchema = z.enum(["text", "image", "video", "audio"]);
export const agreementStatusSchema = z.enum(["draft", "pending_signature", "signed", "active", "expired"]);
export const eventTypeSchema = z.enum(["conference", "workshop", "training", "venue_booking", "church_event"]);

export interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  role: z.infer<typeof userRoleSchema>;
  avatar?: string;
  verified: boolean;
  documentsVerified: boolean;
  deviceId?: string;
  devices: TrustedDevice[];
  twoFactorEnabled: boolean;
  rewardPoints: number;
  organizationId?: string;
  trustScore: number;
  trustLevel: z.infer<typeof trustLevelSchema>;
  blacklisted: boolean;
  blacklistReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TrustedDevice {
  id: string;
  deviceId: string;
  deviceName: string;
  lastUsed: Date;
  trusted: boolean;
  addedAt: Date;
}

export interface Property {
  id: string;
  userId: string;
  type: z.infer<typeof propertyTypeSchema>;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  location: {
    address: string;
    lat: number;
    lng: number;
    area: string;
    city: string;
    country: string;
  };
  images: string[];
  videos: string[];
  amenities: string[];
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  available: boolean;
  featured: boolean;
  boosted: boolean;
  boostExpiresAt?: Date;
  views: number;
  saves: number;
  leads: number;
  rating: number;
  reviewCount: number;
  qualityScore: number;
  aiPriceSuggestion?: number;
  priceCompetitiveness?: "good_deal" | "fair" | "overpriced";
  neighborhoodData?: NeighborhoodData;
  createdAt: Date;
  updatedAt: Date;
}

export interface NeighborhoodData {
  schools: { name: string; distance: number; rating?: number }[];
  hospitals: { name: string; distance: number; type: string }[];
  transport: { type: string; name: string; distance: number }[];
  safetyRating: number;
  noiseLevel: "quiet" | "moderate" | "busy";
}

export interface Booking {
  id: string;
  userId: string;
  propertyId?: string;
  serviceId?: string;
  roomNumber?: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  totalPrice: number;
  currency: string;
  status: z.infer<typeof bookingStatusSchema>;
  qrCode: string;
  specialRequests?: string;
  paymentStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Ticket {
  id: string;
  userId: string;
  propertyId?: string;
  assignedTo?: string;
  type: z.infer<typeof ticketTypeSchema>;
  title: string;
  description: string;
  status: z.infer<typeof ticketStatusSchema>;
  priority: "low" | "medium" | "high";
  images: string[];
  videos: string[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  tier: z.infer<typeof subscriptionTierSchema>;
  category: string;
  price: number;
  currency: string;
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  active: boolean;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: z.infer<typeof notificationTypeSchema>;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: Date;
}

export interface Post {
  id: string;
  userId: string;
  businessId?: string;
  type: "post" | "reel";
  content: string;
  media: string[];
  hashtags: string[];
  likes: number;
  comments: number;
  shares: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Business {
  id: string;
  userId: string;
  name: string;
  description: string;
  category: string;
  logo?: string;
  coverImage?: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  followers: number;
  rating: number;
  reviewCount: number;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  userId: string;
  propertyId?: string;
  serviceId?: string;
  businessId?: string;
  rating: number;
  comment: string;
  images: string[];
  verified: boolean;
  helpful: number;
  createdAt: Date;
}

export interface Payment {
  id: string;
  userId: string;
  bookingId?: string;
  subscriptionId?: string;
  amount: number;
  currency: string;
  method: "mpesa" | "stripe" | "paypal" | "card";
  status: "pending" | "completed" | "failed" | "refunded";
  transactionId?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  propertyId?: string;
  bookingId?: string;
  type: z.infer<typeof messageTypeSchema>;
  content: string;
  mediaUrl?: string;
  read: boolean;
  delivered: boolean;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  participants: string[];
  propertyId?: string;
  bookingId?: string;
  lastMessage?: string;
  lastMessageAt: Date;
  unreadCount: Record<string, number>;
  typing: string[];
  createdAt: Date;
}

export interface Analytics {
  userId: string;
  date: Date;
  views: number;
  clicks: number;
  bookings: number;
  revenue: number;
  leads: number;
}

export interface TrustScore {
  userId: string;
  score: number;
  level: z.infer<typeof trustLevelSchema>;
  factors: {
    verifiedDocuments: number;
    completedBookings: number;
    responseTime: number;
    cancellationRate: number;
    reviewScore: number;
    disputeHistory: number;
  };
  lastCalculated: Date;
}

export interface EscrowPayment {
  id: string;
  bookingId: string;
  payerId: string;
  payeeId: string;
  amount: number;
  currency: string;
  status: z.infer<typeof escrowStatusSchema>;
  heldAt: Date;
  releaseScheduledAt?: Date;
  releasedAt?: Date;
  disputeReason?: string;
  disputedAt?: Date;
  metadata?: Record<string, unknown>;
}

export interface DigitalAgreement {
  id: string;
  type: "rental" | "booking" | "service";
  bookingId?: string;
  propertyId?: string;
  parties: { userId: string; role: string; signed: boolean; signedAt?: Date }[];
  status: z.infer<typeof agreementStatusSchema>;
  documentUrl: string;
  terms: Record<string, unknown>;
  createdAt: Date;
  expiresAt?: Date;
}

export interface TenantProfile {
  userId: string;
  pastStays: number;
  avgRating: number;
  paymentReliability: number;
  reviewCount: number;
  cancellationRate: number;
  lastStayDate?: Date;
  issues: { type: string; date: Date; resolved: boolean }[];
}

export interface Event {
  id: string;
  organizerId: string;
  venueId?: string;
  type: z.infer<typeof eventTypeSchema>;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  capacity: number;
  ticketPrice: number;
  currency: string;
  images: string[];
  ticketsSold: number;
  status: "draft" | "published" | "ongoing" | "completed" | "cancelled";
  createdAt: Date;
}

export interface EventTicket {
  id: string;
  eventId: string;
  userId: string;
  qrCode: string;
  purchaseDate: Date;
  checkInDate?: Date;
  status: "valid" | "used" | "cancelled" | "refunded";
  escrowPaymentId?: string;
}

export interface RentInvoice {
  id: string;
  tenantId: string;
  landlordId: string;
  propertyId: string;
  month: string;
  amount: number;
  currency: string;
  dueDate: Date;
  paidDate?: Date;
  lateFee?: number;
  status: "pending" | "paid" | "overdue" | "partial";
  partialPayments: { amount: number; date: Date }[];
  generatedAt: Date;
}
