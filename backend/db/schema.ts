import { z } from "zod";

export const userRoleSchema = z.enum(["user", "agent", "landlord", "service_provider", "admin"]);
export const propertyTypeSchema = z.enum(["rental", "sale", "hospitality", "service"]);
export const ticketTypeSchema = z.enum(["repair", "vacate", "complaint", "other"]);
export const ticketStatusSchema = z.enum(["open", "claimed", "in_progress", "resolved", "closed"]);
export const bookingStatusSchema = z.enum(["pending", "confirmed", "checked_in", "checked_out", "cancelled"]);
export const subscriptionTierSchema = z.enum(["free", "weekly", "monthly", "yearly"]);
export const notificationTypeSchema = z.enum(["booking", "payment", "ticket", "reward", "boost", "general"]);

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
  twoFactorEnabled: boolean;
  rewardPoints: number;
  organizationId?: string;
  createdAt: Date;
  updatedAt: Date;
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
  createdAt: Date;
  updatedAt: Date;
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
  senderId: string;
  receiverId: string;
  propertyId?: string;
  content: string;
  read: boolean;
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
