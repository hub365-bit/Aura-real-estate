import type {
  User,
  Property,
  Booking,
  Ticket,
  Subscription,
  Notification,
  Post,
  Business,
  Review,
  Payment,
  Message,
  Analytics,
} from "../db/schema";

export interface Database {
  users: {
    findById: (id: string) => Promise<User | null>;
    findByEmail: (email: string) => Promise<User | null>;
    findByPhone: (phone: string) => Promise<User | null>;
    create: (data: Omit<User, "id" | "createdAt" | "updatedAt">) => Promise<User>;
    update: (id: string, data: Partial<User>) => Promise<User>;
    delete: (id: string) => Promise<void>;
    list: (filters?: { role?: string; verified?: boolean }) => Promise<User[]>;
  };
  
  properties: {
    findById: (id: string) => Promise<Property | null>;
    create: (data: Omit<Property, "id" | "createdAt" | "updatedAt">) => Promise<Property>;
    update: (id: string, data: Partial<Property>) => Promise<Property>;
    delete: (id: string) => Promise<void>;
    list: (filters?: {
      type?: string;
      category?: string;
      area?: string;
      minPrice?: number;
      maxPrice?: number;
      userId?: string;
      featured?: boolean;
      boosted?: boolean;
    }) => Promise<Property[]>;
    incrementViews: (id: string) => Promise<void>;
    incrementSaves: (id: string) => Promise<void>;
    incrementLeads: (id: string) => Promise<void>;
  };
  
  bookings: {
    findById: (id: string) => Promise<Booking | null>;
    create: (data: Omit<Booking, "id" | "createdAt" | "updatedAt">) => Promise<Booking>;
    update: (id: string, data: Partial<Booking>) => Promise<Booking>;
    list: (filters?: { userId?: string; propertyId?: string; status?: string }) => Promise<Booking[]>;
  };
  
  tickets: {
    findById: (id: string) => Promise<Ticket | null>;
    create: (data: Omit<Ticket, "id" | "createdAt" | "updatedAt">) => Promise<Ticket>;
    update: (id: string, data: Partial<Ticket>) => Promise<Ticket>;
    list: (filters?: { userId?: string; assignedTo?: string; status?: string; type?: string }) => Promise<Ticket[]>;
  };
  
  subscriptions: {
    findById: (id: string) => Promise<Subscription | null>;
    findActiveByUserId: (userId: string) => Promise<Subscription | null>;
    create: (data: Omit<Subscription, "id" | "createdAt">) => Promise<Subscription>;
    update: (id: string, data: Partial<Subscription>) => Promise<Subscription>;
    list: (filters?: { userId?: string; active?: boolean }) => Promise<Subscription[]>;
  };
  
  notifications: {
    create: (data: Omit<Notification, "id" | "createdAt">) => Promise<Notification>;
    list: (userId: string, filters?: { read?: boolean; type?: string }) => Promise<Notification[]>;
    markRead: (id: string) => Promise<void>;
    markAllRead: (userId: string) => Promise<void>;
  };
  
  posts: {
    findById: (id: string) => Promise<Post | null>;
    create: (data: Omit<Post, "id" | "createdAt" | "updatedAt">) => Promise<Post>;
    update: (id: string, data: Partial<Post>) => Promise<Post>;
    delete: (id: string) => Promise<void>;
    list: (filters?: { userId?: string; businessId?: string; type?: string }) => Promise<Post[]>;
    incrementLikes: (id: string) => Promise<void>;
    incrementComments: (id: string) => Promise<void>;
  };
  
  businesses: {
    findById: (id: string) => Promise<Business | null>;
    create: (data: Omit<Business, "id" | "createdAt" | "updatedAt">) => Promise<Business>;
    update: (id: string, data: Partial<Business>) => Promise<Business>;
    list: (filters?: { userId?: string; category?: string; verified?: boolean }) => Promise<Business[]>;
    incrementFollowers: (id: string) => Promise<void>;
    decrementFollowers: (id: string) => Promise<void>;
  };
  
  reviews: {
    findById: (id: string) => Promise<Review | null>;
    create: (data: Omit<Review, "id" | "createdAt">) => Promise<Review>;
    list: (filters?: { userId?: string; propertyId?: string; businessId?: string }) => Promise<Review[]>;
    incrementHelpful: (id: string) => Promise<void>;
  };
  
  payments: {
    findById: (id: string) => Promise<Payment | null>;
    create: (data: Omit<Payment, "id" | "createdAt">) => Promise<Payment>;
    update: (id: string, data: Partial<Payment>) => Promise<Payment>;
    list: (filters?: { userId?: string; status?: string; method?: string }) => Promise<Payment[]>;
  };
  
  messages: {
    findById: (id: string) => Promise<Message | null>;
    create: (data: Omit<Message, "id" | "createdAt">) => Promise<Message>;
    list: (filters: { senderId?: string; receiverId?: string; propertyId?: string }) => Promise<Message[]>;
    markRead: (id: string) => Promise<void>;
  };
  
  analytics: {
    getUserAnalytics: (userId: string, startDate: Date, endDate: Date) => Promise<Analytics[]>;
    recordView: (userId: string) => Promise<void>;
    recordClick: (userId: string) => Promise<void>;
    recordBooking: (userId: string, revenue: number) => Promise<void>;
    recordLead: (userId: string) => Promise<void>;
  };
}

export async function createDatabase(): Promise<Database> {
  const dbUrl = process.env.DATABASE_URL;
  
  if (!dbUrl) {
    console.warn("⚠️  DATABASE_URL not set - using mock database");
    const { mockDb } = await import("../db/mock-db");
    return mockDb;
  }
  
  console.log("🔌 Connecting to production database...");
  throw new Error("Production database not configured. Add database implementation here.");
}

let dbInstance: Database | null = null;

export async function getDatabase(): Promise<Database> {
  if (!dbInstance) {
    dbInstance = await createDatabase();
  }
  return dbInstance;
}
