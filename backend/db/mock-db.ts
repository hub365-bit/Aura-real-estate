import type { User, Property, Booking, Ticket, Subscription, Notification, Post, Business, Review, Payment, Message, Analytics } from "./schema";

class MockDatabase {
  private users: Map<string, User> = new Map();
  private properties: Map<string, Property> = new Map();
  private bookings: Map<string, Booking> = new Map();
  private tickets: Map<string, Ticket> = new Map();
  private subscriptions: Map<string, Subscription> = new Map();
  private notifications: Map<string, Notification> = new Map();
  private posts: Map<string, Post> = new Map();
  private businesses: Map<string, Business> = new Map();
  private reviews: Map<string, Review> = new Map();
  private payments: Map<string, Payment> = new Map();
  private messages: Map<string, Message> = new Map();
  private analytics: Map<string, Analytics[]> = new Map();

  constructor() {
    this.seedMockData();
  }

  private seedMockData() {
    const mockUser: User = {
      id: "mock-user-id",
      email: "test@example.com",
      phone: "+254700000000",
      name: "Test User",
      role: "user",
      verified: true,
      documentsVerified: false,
      devices: [],
      twoFactorEnabled: false,
      rewardPoints: 150,
      trustScore: 85,
      trustLevel: "verified",
      blacklisted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(mockUser.id, mockUser);

    const mockProperty: Property = {
      id: "prop-1",
      userId: mockUser.id,
      type: "rental",
      title: "Modern 2BR Apartment in Westlands",
      description: "Beautiful apartment with city views",
      price: 75000,
      currency: "KSh",
      category: "Apartment",
      location: {
        address: "Westlands, Nairobi",
        lat: -1.2696,
        lng: 36.8065,
        area: "Westlands",
        city: "Nairobi",
        country: "Kenya",
      },
      images: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      ],
      videos: [],
      amenities: ["WiFi", "Parking", "Security", "Gym"],
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      available: true,
      featured: false,
      boosted: false,
      views: 245,
      saves: 32,
      leads: 15,
      rating: 4.5,
      reviewCount: 12,
      qualityScore: 85,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.properties.set(mockProperty.id, mockProperty);
  }

  getUsers() {
    return Array.from(this.users.values());
  }

  getUser(id: string) {
    return this.users.get(id);
  }

  getUserByEmail(email: string) {
    return Array.from(this.users.values()).find(u => u.email === email);
  }

  createUser(user: User) {
    this.users.set(user.id, user);
    return user;
  }

  updateUser(id: string, updates: Partial<User>) {
    const user = this.users.get(id);
    if (!user) return null;
    const updated = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updated);
    return updated;
  }

  getProperties(filters?: { type?: string; userId?: string; available?: boolean }) {
    let props = Array.from(this.properties.values());
    if (filters?.type) {
      props = props.filter(p => p.type === filters.type);
    }
    if (filters?.userId) {
      props = props.filter(p => p.userId === filters.userId);
    }
    if (filters?.available !== undefined) {
      props = props.filter(p => p.available === filters.available);
    }
    return props;
  }

  getProperty(id: string) {
    return this.properties.get(id);
  }

  createProperty(property: Property) {
    this.properties.set(property.id, property);
    return property;
  }

  updateProperty(id: string, updates: Partial<Property>) {
    const property = this.properties.get(id);
    if (!property) return null;
    const updated = { ...property, ...updates, updatedAt: new Date() };
    this.properties.set(id, updated);
    return updated;
  }

  deleteProperty(id: string) {
    return this.properties.delete(id);
  }

  getBookings(userId?: string) {
    let bookings = Array.from(this.bookings.values());
    if (userId) {
      bookings = bookings.filter(b => b.userId === userId);
    }
    return bookings;
  }

  getBooking(id: string) {
    return this.bookings.get(id);
  }

  createBooking(booking: Booking) {
    this.bookings.set(booking.id, booking);
    return booking;
  }

  updateBooking(id: string, updates: Partial<Booking>) {
    const booking = this.bookings.get(id);
    if (!booking) return null;
    const updated = { ...booking, ...updates, updatedAt: new Date() };
    this.bookings.set(id, updated);
    return updated;
  }

  getTickets(filters?: { userId?: string; assignedTo?: string; status?: string }) {
    let tickets = Array.from(this.tickets.values());
    if (filters?.userId) {
      tickets = tickets.filter(t => t.userId === filters.userId);
    }
    if (filters?.assignedTo) {
      tickets = tickets.filter(t => t.assignedTo === filters.assignedTo);
    }
    if (filters?.status) {
      tickets = tickets.filter(t => t.status === filters.status);
    }
    return tickets;
  }

  getTicket(id: string) {
    return this.tickets.get(id);
  }

  createTicket(ticket: Ticket) {
    this.tickets.set(ticket.id, ticket);
    return ticket;
  }

  updateTicket(id: string, updates: Partial<Ticket>) {
    const ticket = this.tickets.get(id);
    if (!ticket) return null;
    const updated = { ...ticket, ...updates, updatedAt: new Date() };
    this.tickets.set(id, updated);
    return updated;
  }

  getSubscriptions(userId?: string) {
    let subs = Array.from(this.subscriptions.values());
    if (userId) {
      subs = subs.filter(s => s.userId === userId);
    }
    return subs;
  }

  createSubscription(subscription: Subscription) {
    this.subscriptions.set(subscription.id, subscription);
    return subscription;
  }

  getNotifications(userId: string, unreadOnly = false) {
    let notifs = Array.from(this.notifications.values()).filter(n => n.userId === userId);
    if (unreadOnly) {
      notifs = notifs.filter(n => !n.read);
    }
    return notifs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  createNotification(notification: Notification) {
    this.notifications.set(notification.id, notification);
    return notification;
  }

  markNotificationRead(id: string) {
    const notif = this.notifications.get(id);
    if (!notif) return null;
    notif.read = true;
    return notif;
  }

  getPosts(filters?: { userId?: string; businessId?: string; type?: string }) {
    let posts = Array.from(this.posts.values());
    if (filters?.userId) {
      posts = posts.filter(p => p.userId === filters.userId);
    }
    if (filters?.businessId) {
      posts = posts.filter(p => p.businessId === filters.businessId);
    }
    if (filters?.type) {
      posts = posts.filter(p => p.type === filters.type);
    }
    return posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  createPost(post: Post) {
    this.posts.set(post.id, post);
    return post;
  }

  getBusinesses(userId?: string) {
    let businesses = Array.from(this.businesses.values());
    if (userId) {
      businesses = businesses.filter(b => b.userId === userId);
    }
    return businesses;
  }

  getBusiness(id: string) {
    return this.businesses.get(id);
  }

  createBusiness(business: Business) {
    this.businesses.set(business.id, business);
    return business;
  }

  getReviews(filters?: { propertyId?: string; serviceId?: string; businessId?: string }) {
    let reviews = Array.from(this.reviews.values());
    if (filters?.propertyId) {
      reviews = reviews.filter(r => r.propertyId === filters.propertyId);
    }
    if (filters?.serviceId) {
      reviews = reviews.filter(r => r.serviceId === filters.serviceId);
    }
    if (filters?.businessId) {
      reviews = reviews.filter(r => r.businessId === filters.businessId);
    }
    return reviews.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  createReview(review: Review) {
    this.reviews.set(review.id, review);
    return review;
  }

  getPayments(userId?: string) {
    let payments = Array.from(this.payments.values());
    if (userId) {
      payments = payments.filter(p => p.userId === userId);
    }
    return payments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  createPayment(payment: Payment) {
    this.payments.set(payment.id, payment);
    return payment;
  }

  getMessages(userId: string) {
    return Array.from(this.messages.values())
      .filter(m => m.senderId === userId || m.receiverId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  createMessage(message: Message) {
    this.messages.set(message.id, message);
    return message;
  }

  getAnalytics(userId: string, startDate: Date, endDate: Date) {
    const userAnalytics = this.analytics.get(userId) || [];
    return userAnalytics.filter(
      a => a.date >= startDate && a.date <= endDate
    );
  }

  addAnalytics(analytics: Analytics) {
    const userAnalytics = this.analytics.get(analytics.userId) || [];
    userAnalytics.push(analytics);
    this.analytics.set(analytics.userId, userAnalytics);
    return analytics;
  }
}

const mockDbInstance = new MockDatabase();

export const db = mockDbInstance;

export default {
  users: {
    findById: async (id: string) => mockDbInstance.getUser(id) || null,
    findByEmail: async (email: string) => mockDbInstance.getUserByEmail(email) || null,
    findByPhone: async (phone: string) => mockDbInstance.getUsers().find(u => u.phone === phone) || null,
    create: async (data: any) => {
      const user = { ...data, id: `user-${Date.now()}`, createdAt: new Date(), updatedAt: new Date() };
      return mockDbInstance.createUser(user);
    },
    update: async (id: string, data: any) => mockDbInstance.updateUser(id, data)!,
    delete: async (id: string) => { mockDbInstance.getUsers().filter(u => u.id !== id); },
    list: async (filters?: any) => mockDbInstance.getUsers(),
  },
  properties: {
    findById: async (id: string) => mockDbInstance.getProperty(id) || null,
    create: async (data: any) => {
      const property = { ...data, id: `prop-${Date.now()}`, createdAt: new Date(), updatedAt: new Date() };
      return mockDbInstance.createProperty(property);
    },
    update: async (id: string, data: any) => mockDbInstance.updateProperty(id, data)!,
    delete: async (id: string) => { mockDbInstance.deleteProperty(id); },
    list: async (filters?: any) => mockDbInstance.getProperties(filters),
    incrementViews: async (id: string) => {
      const prop = mockDbInstance.getProperty(id);
      if (prop) mockDbInstance.updateProperty(id, { views: prop.views + 1 });
    },
    incrementSaves: async (id: string) => {
      const prop = mockDbInstance.getProperty(id);
      if (prop) mockDbInstance.updateProperty(id, { saves: prop.saves + 1 });
    },
    incrementLeads: async (id: string) => {
      const prop = mockDbInstance.getProperty(id);
      if (prop) mockDbInstance.updateProperty(id, { leads: prop.leads + 1 });
    },
  },
  bookings: {
    findById: async (id: string) => mockDbInstance.getBooking(id) || null,
    create: async (data: any) => {
      const booking = { ...data, id: `booking-${Date.now()}`, createdAt: new Date(), updatedAt: new Date() };
      return mockDbInstance.createBooking(booking);
    },
    update: async (id: string, data: any) => mockDbInstance.updateBooking(id, data)!,
    list: async (filters?: any) => mockDbInstance.getBookings(filters?.userId),
  },
  tickets: {
    findById: async (id: string) => mockDbInstance.getTicket(id) || null,
    create: async (data: any) => {
      const ticket = { ...data, id: `ticket-${Date.now()}`, createdAt: new Date(), updatedAt: new Date() };
      return mockDbInstance.createTicket(ticket);
    },
    update: async (id: string, data: any) => mockDbInstance.updateTicket(id, data)!,
    list: async (filters?: any) => mockDbInstance.getTickets(filters),
  },
  subscriptions: {
    findById: async (id: string) => mockDbInstance.getSubscriptions().find(s => s.id === id) || null,
    findActiveByUserId: async (userId: string) => mockDbInstance.getSubscriptions(userId).find(s => s.active) || null,
    create: async (data: any) => {
      const subscription = { ...data, id: `sub-${Date.now()}`, createdAt: new Date() };
      return mockDbInstance.createSubscription(subscription);
    },
    update: async (id: string, data: any) => {
      const sub = mockDbInstance.getSubscriptions().find(s => s.id === id);
      return sub ? { ...sub, ...data } : sub!;
    },
    list: async (filters?: any) => mockDbInstance.getSubscriptions(filters?.userId),
  },
  notifications: {
    create: async (data: any) => {
      const notification = { ...data, id: `notif-${Date.now()}`, createdAt: new Date() };
      return mockDbInstance.createNotification(notification);
    },
    list: async (userId: string, filters?: any) => mockDbInstance.getNotifications(userId, filters?.read === false),
    markRead: async (id: string) => { mockDbInstance.markNotificationRead(id); },
    markAllRead: async (userId: string) => {
      mockDbInstance.getNotifications(userId).forEach(n => mockDbInstance.markNotificationRead(n.id));
    },
  },
  posts: {
    findById: async (id: string) => mockDbInstance.getPosts().find(p => p.id === id) || null,
    create: async (data: any) => {
      const post = { ...data, id: `post-${Date.now()}`, createdAt: new Date(), updatedAt: new Date() };
      return mockDbInstance.createPost(post);
    },
    update: async (id: string, data: any) => {
      const post = mockDbInstance.getPosts().find(p => p.id === id);
      return post ? { ...post, ...data, updatedAt: new Date() } : post!;
    },
    delete: async (id: string) => {},
    list: async (filters?: any) => mockDbInstance.getPosts(filters),
    incrementLikes: async (id: string) => {},
    incrementComments: async (id: string) => {},
  },
  businesses: {
    findById: async (id: string) => mockDbInstance.getBusiness(id) || null,
    create: async (data: any) => {
      const business = { ...data, id: `biz-${Date.now()}`, createdAt: new Date(), updatedAt: new Date() };
      return mockDbInstance.createBusiness(business);
    },
    update: async (id: string, data: any) => {
      const biz = mockDbInstance.getBusiness(id);
      return biz ? { ...biz, ...data, updatedAt: new Date() } : biz!;
    },
    list: async (filters?: any) => mockDbInstance.getBusinesses(filters?.userId),
    incrementFollowers: async (id: string) => {},
    decrementFollowers: async (id: string) => {},
  },
  reviews: {
    findById: async (id: string) => mockDbInstance.getReviews().find(r => r.id === id) || null,
    create: async (data: any) => {
      const review = { ...data, id: `review-${Date.now()}`, createdAt: new Date() };
      return mockDbInstance.createReview(review);
    },
    list: async (filters?: any) => mockDbInstance.getReviews(filters),
    incrementHelpful: async (id: string) => {},
  },
  payments: {
    findById: async (id: string) => mockDbInstance.getPayments().find(p => p.id === id) || null,
    create: async (data: any) => {
      const payment = { ...data, id: `payment-${Date.now()}`, createdAt: new Date() };
      return mockDbInstance.createPayment(payment);
    },
    update: async (id: string, data: any) => {
      const payment = mockDbInstance.getPayments().find(p => p.id === id);
      return payment ? { ...payment, ...data } : payment!;
    },
    list: async (filters?: any) => mockDbInstance.getPayments(filters?.userId),
  },
  messages: {
    findById: async (id: string) => mockDbInstance.getMessages('').find(m => m.id === id) || null,
    create: async (data: any) => {
      const message = { ...data, id: `msg-${Date.now()}`, createdAt: new Date() };
      return mockDbInstance.createMessage(message);
    },
    list: async (filters: any) => mockDbInstance.getMessages(filters.senderId || filters.receiverId || ''),
    markRead: async (id: string) => {},
  },
  analytics: {
    getUserAnalytics: async (userId: string, startDate: Date, endDate: Date) => mockDbInstance.getAnalytics(userId, startDate, endDate),
    recordView: async (userId: string) => {},
    recordClick: async (userId: string) => {},
    recordBooking: async (userId: string, revenue: number) => {},
    recordLead: async (userId: string) => {},
  },
};
