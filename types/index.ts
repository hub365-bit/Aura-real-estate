export type UserRole = 'user' | 'agent' | 'landlord' | 'hotel' | 'service_provider' | 'admin';

export type PropertyType = 'house' | 'apartment' | 'office' | 'land' | 'commercial';
export type ListingCategory = 'rental' | 'sale' | 'hospitality' | 'service';
export type PropertyStatus = 'available' | 'rented' | 'sold' | 'pending';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  verified: boolean;
  subscriptionTier?: SubscriptionTier;
  subscriptionExpiry?: string;
  rewardPoints: number;
  followersCount?: number;
  followingCount?: number;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  category: ListingCategory;
  propertyType: PropertyType;
  price: number;
  currency: string;
  location: {
    address: string;
    city: string;
    country: string;
    lat: number;
    lng: number;
  };
  images: string[];
  videos?: string[];
  features: string[];
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  areaUnit?: 'sqft' | 'sqm';
  status: PropertyStatus;
  agentId: string;
  agentName: string;
  agentAvatar?: string;
  views: number;
  saves: number;
  rating: number;
  reviewsCount: number;
  boosted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceProvider {
  id: string;
  businessName: string;
  description: string;
  category: string;
  subCategories: string[];
  owner: User;
  location: {
    address: string;
    city: string;
    country: string;
    lat: number;
    lng: number;
  };
  images: string[];
  services: Service[];
  workingHours: WorkingHours;
  rating: number;
  reviewsCount: number;
  followersCount: number;
  boosted: boolean;
  subscriptionTier?: SubscriptionTier;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration?: number;
  durationUnit?: 'minutes' | 'hours' | 'days';
}

export interface WorkingHours {
  monday: { open: string; close: string; closed: boolean };
  tuesday: { open: string; close: string; closed: boolean };
  wednesday: { open: string; close: string; closed: boolean };
  thursday: { open: string; close: string; closed: boolean };
  friday: { open: string; close: string; closed: boolean };
  saturday: { open: string; close: string; closed: boolean };
  sunday: { open: string; close: string; closed: boolean };
}

export interface Booking {
  id: string;
  type: 'property' | 'service' | 'room' | 'table';
  propertyId?: string;
  serviceProviderId?: string;
  userId: string;
  userName: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  timeSlot?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalAmount: number;
  currency: string;
  qrCode?: string;
  bookingRef: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorRole: UserRole;
  type: 'post' | 'reel';
  content: string;
  media: string[];
  hashtags: string[];
  likes: number;
  commentsCount: number;
  sharesCount: number;
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  likes: number;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  propertyId?: string;
  serviceProviderId?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  type: 'repair' | 'vacate' | 'complaint' | 'other';
  title: string;
  description: string;
  propertyId?: string;
  tenantId: string;
  agentId: string;
  status: 'open' | 'claimed' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

export type SubscriptionTier = 'free' | 'weekly' | 'monthly' | 'yearly';

export interface SubscriptionPlan {
  tier: SubscriptionTier;
  category: 'hotel' | 'service' | 'property' | 'boost';
  weeklyPrice?: number;
  monthlyPrice?: number;
  yearlyPrice?: number;
  currency: string;
  features: string[];
}

export interface FilterOptions {
  category?: ListingCategory;
  propertyType?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  bedrooms?: number;
  bathrooms?: number;
  searchQuery?: string;
}
