export type UserRole = 'user' | 'agent' | 'landlord' | 'hotel' | 'service_provider' | 'admin';

export type PropertyType = 'house' | 'apartment' | 'office' | 'land' | 'commercial';
export type ListingCategory = 'rental' | 'sale' | 'hospitality' | 'service';
export type PropertyStatus = 'available' | 'rented' | 'sold' | 'pending';

export type TrustLevel = 'verified' | 'building' | 'restricted';

export interface TrustScore {
  score: number;
  level: TrustLevel;
  verifiedId: boolean;
  verifiedBusiness: boolean;
  completedBookings: number;
  avgResponseTime: number;
  cancellationRate: number;
  disputeCount: number;
  lastUpdated: string;
}

export interface Device {
  id: string;
  name: string;
  platform: string;
  lastUsed: string;
  trusted: boolean;
}

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
  trustScore?: TrustScore;
  devices?: Device[];
  paymentReliability?: number;
  blacklisted?: boolean;
}

export interface QualityScore {
  overall: number;
  photoQuality: number;
  descriptionCompleteness: number;
  responseSpeed: number;
  reviewScore: number;
  suggestions: string[];
}

export interface NeighborhoodInfo {
  schools: { name: string; distance: number; rating: number }[];
  hospitals: { name: string; distance: number; type: string }[];
  transport: { type: string; name: string; distance: number }[];
  safetyRating: number;
  noiseLevel: 'low' | 'medium' | 'high';
  activityLevel: 'quiet' | 'moderate' | 'busy';
}

export interface PriceIntelligence {
  suggestedPrice: number;
  marketAverage: number;
  competitiveness: 'low' | 'fair' | 'competitive' | 'high';
  priceLabel: 'great-deal' | 'fair-price' | 'overpriced';
  bestPostingTime: string;
  demandLevel: 'low' | 'medium' | 'high';
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
  trustScore?: TrustScore;
  qualityScore?: QualityScore;
  neighborhoodInfo?: NeighborhoodInfo;
  priceIntelligence?: PriceIntelligence;
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

export type EscrowStatus = 'held' | 'released' | 'refunded' | 'disputed';

export interface Escrow {
  bookingId: string;
  amount: number;
  currency: string;
  status: EscrowStatus;
  heldAt: string;
  releaseScheduled?: string;
  releasedAt?: string;
  disputeReason?: string;
}

export interface Booking {
  id: string;
  type: 'property' | 'service' | 'room' | 'table' | 'event';
  propertyId?: string;
  serviceProviderId?: string;
  eventId?: string;
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
  escrow?: Escrow;
  agreementId?: string;
  conversationId?: string;
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

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  receiverId: string;
  content: string;
  mediaUrls?: string[];
  type: 'text' | 'image' | 'video';
  read: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participants: User[];
  bookingId?: string;
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
}

export interface Agreement {
  id: string;
  type: 'rental' | 'booking' | 'service';
  bookingId?: string;
  propertyId?: string;
  parties: { userId: string; name: string; role: string; signed: boolean; signedAt?: string }[];
  content: string;
  pdfUrl?: string;
  status: 'draft' | 'pending' | 'signed' | 'expired';
  createdAt: string;
  expiresAt?: string;
}

export interface RentInvoice {
  id: string;
  tenantId: string;
  tenantName: string;
  landlordId: string;
  propertyId: string;
  amount: number;
  currency: string;
  dueDate: string;
  paidAmount: number;
  paidAt?: string;
  lateFee: number;
  status: 'unpaid' | 'partial' | 'paid' | 'overdue';
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: 'conference' | 'training' | 'religious' | 'social' | 'other';
  location: {
    name: string;
    address: string;
    city: string;
    lat: number;
    lng: number;
  };
  startDate: string;
  endDate: string;
  price: number;
  currency: string;
  capacity: number;
  booked: number;
  images: string[];
  organizerId: string;
  organizerName: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface EventTicket {
  id: string;
  eventId: string;
  userId: string;
  qrCode: string;
  status: 'valid' | 'used' | 'cancelled';
  purchasedAt: string;
  usedAt?: string;
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
  trustLevel?: TrustLevel;
  qualityScoreMin?: number;
}
