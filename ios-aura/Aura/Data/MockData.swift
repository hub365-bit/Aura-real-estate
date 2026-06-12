import Foundation

/// Bundled mock data matching the Expo app's mock data exactly.
enum MockData {

    static let currentUser = User(
        id: "u10", name: "James Ochieng", email: "james@example.com",
        phone: "+254700123456", role: .user,
        avatar: "https://i.pravatar.cc/150?img=33", verified: true,
        subscriptionTier: .free, rewardPoints: 1250,
        followersCount: 48, followingCount: 112,
        trustScore: .sample(.verified, score: 88),
        paymentReliability: 0.96, blacklisted: false
    )

    // MARK: Properties

    static let properties: [Property] = [
        Property(
            id: "p1", title: "Modern 3BR Apartment in Kilimani",
            description: "Spacious and modern 3-bedroom apartment in the heart of Kilimani. Features include a well-fitted kitchen, spacious living room, master ensuite, and ample parking. Close to shopping malls, hospitals, and schools.",
            category: .rental, propertyType: .apartment, price: 85000, currency: "KSh",
            location: GeoLocation(address: "Ring Road, Kilimani", city: "Nairobi", country: "Kenya", lat: -1.2884, lng: 36.7856),
            images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
                     "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
                     "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"],
            features: ["Parking", "Security", "Gym", "Swimming Pool", "Backup Generator"],
            bedrooms: 3, bathrooms: 2, area: 1200, areaUnit: "sqft", status: .available,
            agentId: "a1", agentName: "Sarah Mutua", agentAvatar: "https://i.pravatar.cc/150?img=5",
            views: 342, saves: 28, rating: 4.5, reviewsCount: 12, boosted: true,
            trustScore: .sample(.verified, score: 94),
            qualityScore: QualityScore(overall: 88, photoQuality: 90, descriptionCompleteness: 85, responseSpeed: 92, reviewScore: 85, suggestions: ["Add a video walkthrough", "List nearby amenities"]),
            neighborhoodInfo: NeighborhoodInfo(
                schools: [NamedDistance(name: "Kilimani Primary", distance: 0.8, rating: 4.3, type: nil)],
                hospitals: [NamedDistance(name: "Nairobi Hospital", distance: 2.1, rating: nil, type: "General")],
                transport: [NamedDistance(name: "Yaya Centre Stage", distance: 0.5, rating: nil, type: "Matatu")],
                safetyRating: 4.2, noiseLevel: "medium", activityLevel: "busy"),
            priceIntelligence: PriceIntelligence(suggestedPrice: 82000, marketAverage: 90000, competitiveness: "competitive", priceLabel: "great-deal", bestPostingTime: "Weekday evenings", demandLevel: "high")
        ),
        Property(
            id: "p2", title: "1/4 Acre Land in Ruiru",
            description: "Prime residential plot for sale in Ruiru. Ready title deed, all utilities available, ideal for residential development. Easy access to Thika Road.",
            category: .sale, propertyType: .land, price: 3500000, currency: "KSh",
            location: GeoLocation(address: "Membley Estate, Ruiru", city: "Ruiru", country: "Kenya", lat: -1.1531, lng: 36.9630),
            images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
                     "https://images.unsplash.com/photo-1464146072230-91cabc968266?w=800"],
            features: ["Title Deed", "Water", "Electricity", "Accessible Road"],
            bedrooms: nil, bathrooms: nil, area: 10890, areaUnit: "sqft", status: .available,
            agentId: "a2", agentName: "John Kamau", agentAvatar: "https://i.pravatar.cc/150?img=8",
            views: 156, saves: 45, rating: 4.8, reviewsCount: 8, boosted: false,
            trustScore: .sample(.verified, score: 90), qualityScore: nil, neighborhoodInfo: nil, priceIntelligence: nil
        ),
        Property(
            id: "p3", title: "Luxury 5BR Villa in Karen",
            description: "Exquisite 5-bedroom villa in Karen with stunning views. Features include modern kitchen, spacious living areas, lush garden, staff quarters, and secure gated community.",
            category: .rental, propertyType: .house, price: 350000, currency: "KSh",
            location: GeoLocation(address: "Karen Road", city: "Nairobi", country: "Kenya", lat: -1.3217, lng: 36.7078),
            images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
                     "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
                     "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
                     "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800"],
            features: ["Garden", "Staff Quarters", "Parking", "Security", "Swimming Pool"],
            bedrooms: 5, bathrooms: 4, area: 4500, areaUnit: "sqft", status: .available,
            agentId: "a1", agentName: "Sarah Mutua", agentAvatar: "https://i.pravatar.cc/150?img=5",
            views: 521, saves: 87, rating: 4.9, reviewsCount: 24, boosted: true,
            trustScore: .sample(.verified, score: 96), qualityScore: nil, neighborhoodInfo: nil, priceIntelligence: nil
        ),
        Property(
            id: "p4", title: "Commercial Office Space in Westlands",
            description: "Modern office space in prime Westlands location. Open plan layout, fiber internet, backup power, ample parking. Perfect for startups and growing businesses.",
            category: .rental, propertyType: .office, price: 120000, currency: "KSh",
            location: GeoLocation(address: "Woodvale Grove, Westlands", city: "Nairobi", country: "Kenya", lat: -1.2676, lng: 36.8070),
            images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
                     "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800"],
            features: ["Fiber Internet", "Parking", "Security", "Backup Generator", "Meeting Rooms"],
            bedrooms: nil, bathrooms: nil, area: 800, areaUnit: "sqft", status: .available,
            agentId: "a3", agentName: "Michael Omondi", agentAvatar: "https://i.pravatar.cc/150?img=12",
            views: 234, saves: 32, rating: 4.6, reviewsCount: 9, boosted: false,
            trustScore: .sample(.building, score: 68), qualityScore: nil, neighborhoodInfo: nil, priceIntelligence: nil
        ),
        Property(
            id: "p5", title: "Cozy 2BR Bungalow in Ngong",
            description: "Charming 2-bedroom bungalow in peaceful Ngong area. Perfect for small families seeking tranquility. Beautiful compound with kitchen garden space.",
            category: .rental, propertyType: .house, price: 45000, currency: "KSh",
            location: GeoLocation(address: "Ngong Hills", city: "Ngong", country: "Kenya", lat: -1.3524, lng: 36.6510),
            images: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800",
                     "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800"],
            features: ["Garden", "Water Tank", "Parking", "Quiet Neighborhood"],
            bedrooms: 2, bathrooms: 1, area: 650, areaUnit: "sqft", status: .available,
            agentId: "a2", agentName: "John Kamau", agentAvatar: "https://i.pravatar.cc/150?img=8",
            views: 189, saves: 21, rating: 4.4, reviewsCount: 6, boosted: false,
            trustScore: .sample(.verified, score: 85), qualityScore: nil, neighborhoodInfo: nil, priceIntelligence: nil
        ),
        Property(
            id: "p6", title: "Studio Apartment in CBD",
            description: "Affordable studio apartment in the Central Business District. Walking distance to offices, restaurants, and public transport. Ideal for young professionals.",
            category: .rental, propertyType: .apartment, price: 35000, currency: "KSh",
            location: GeoLocation(address: "Koinange Street", city: "Nairobi", country: "Kenya", lat: -1.2864, lng: 36.8172),
            images: ["https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800",
                     "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800"],
            features: ["Security", "Water 24/7", "Elevator"],
            bedrooms: 1, bathrooms: 1, area: 400, areaUnit: "sqft", status: .available,
            agentId: "a3", agentName: "Michael Omondi", agentAvatar: "https://i.pravatar.cc/150?img=12",
            views: 298, saves: 41, rating: 4.2, reviewsCount: 15, boosted: true,
            trustScore: .sample(.building, score: 72), qualityScore: nil, neighborhoodInfo: nil, priceIntelligence: nil
        ),
    ]

    // MARK: Service Providers

    static let serviceProviders: [ServiceProvider] = [
        ServiceProvider(
            id: "s1", businessName: "Swift Plumbing Services",
            description: "Professional plumbing services for residential and commercial properties. Available 24/7 for emergencies.",
            category: "Plumbing", subCategories: ["Repairs", "Installation", "Emergency"],
            owner: User(id: "u1", name: "David Otieno", email: "david@swiftplumbing.com", phone: "+254712345678", role: .serviceProvider, avatar: "https://i.pravatar.cc/150?img=15", verified: true, subscriptionTier: nil, rewardPoints: 0, followersCount: nil, followingCount: nil, trustScore: .sample(), paymentReliability: nil, blacklisted: nil),
            location: GeoLocation(address: "Mombasa Road", city: "Nairobi", country: "Kenya", lat: -1.3093, lng: 36.8354),
            images: ["https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800",
                     "https://images.unsplash.com/photo-1581094794329-c8112e859f60?w=800"],
            services: [
                ServiceItem(id: "sv1", name: "Pipe Repair", description: "Fix leaking or broken pipes", price: 3000, currency: "KSh", duration: 2, durationUnit: "hours"),
                ServiceItem(id: "sv2", name: "Drain Cleaning", description: "Unclog blocked drains and sewers", price: 2500, currency: "KSh", duration: 1, durationUnit: "hours"),
                ServiceItem(id: "sv3", name: "Water Heater Installation", description: "Install or replace water heating systems", price: 8000, currency: "KSh", duration: 4, durationUnit: "hours"),
            ],
            workingHours: weekdayHours(open: "07:00", close: "18:00", satOpen: "08:00", satClose: "14:00"),
            rating: 4.7, reviewsCount: 89, followersCount: 234, boosted: true, subscriptionTier: .monthly
        ),
        ServiceProvider(
            id: "s2", businessName: "Elite Event Planners",
            description: "Creating unforgettable events - weddings, corporate functions, birthdays, and more. Full service event management.",
            category: "Events", subCategories: ["Weddings", "Corporate", "Birthdays", "Catering"],
            owner: User(id: "u2", name: "Grace Wanjiru", email: "grace@eliteevents.co.ke", phone: "+254723456789", role: .serviceProvider, avatar: "https://i.pravatar.cc/150?img=20", verified: true, subscriptionTier: nil, rewardPoints: 0, followersCount: nil, followingCount: nil, trustScore: .sample(), paymentReliability: nil, blacklisted: nil),
            location: GeoLocation(address: "Karen", city: "Nairobi", country: "Kenya", lat: -1.3197, lng: 36.7076),
            images: ["https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
                     "https://images.unsplash.com/photo-1519167758481-83f29da8170d?w=800",
                     "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800"],
            services: [
                ServiceItem(id: "sv4", name: "Wedding Planning", description: "Complete wedding planning and coordination", price: 150000, currency: "KSh", duration: nil, durationUnit: nil),
                ServiceItem(id: "sv5", name: "Corporate Event", description: "Professional corporate event management", price: 80000, currency: "KSh", duration: nil, durationUnit: nil),
                ServiceItem(id: "sv6", name: "Birthday Party", description: "Fun and memorable birthday celebrations", price: 35000, currency: "KSh", duration: nil, durationUnit: nil),
            ],
            workingHours: weekdayHours(open: "09:00", close: "17:00", satOpen: "10:00", satClose: "15:00"),
            rating: 4.9, reviewsCount: 142, followersCount: 567, boosted: true, subscriptionTier: .yearly
        ),
        ServiceProvider(
            id: "s3", businessName: "QuickFix Electricians",
            description: "Licensed electrical contractors. Installation, repairs, and maintenance for homes and businesses.",
            category: "Electrical", subCategories: ["Repairs", "Installation", "Wiring", "Solar"],
            owner: User(id: "u3", name: "Peter Mwangi", email: "peter@quickfixke.com", phone: "+254734567890", role: .serviceProvider, avatar: "https://i.pravatar.cc/150?img=25", verified: true, subscriptionTier: nil, rewardPoints: 0, followersCount: nil, followingCount: nil, trustScore: .sample(.building, score: 70), paymentReliability: nil, blacklisted: nil),
            location: GeoLocation(address: "Ruaka", city: "Nairobi", country: "Kenya", lat: -1.2064, lng: 36.8519),
            images: ["https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800"],
            services: [
                ServiceItem(id: "sv7", name: "Electrical Fault Diagnosis", description: "Identify and fix electrical problems", price: 2000, currency: "KSh", duration: 1, durationUnit: "hours"),
                ServiceItem(id: "sv8", name: "House Wiring", description: "Complete house electrical wiring", price: 45000, currency: "KSh", duration: 3, durationUnit: "days"),
                ServiceItem(id: "sv9", name: "Solar Panel Installation", description: "Install solar power systems", price: 120000, currency: "KSh", duration: 2, durationUnit: "days"),
            ],
            workingHours: weekdayHours(open: "08:00", close: "17:00", satOpen: "08:00", satClose: "13:00"),
            rating: 4.6, reviewsCount: 67, followersCount: 198, boosted: false, subscriptionTier: .monthly
        ),
        ServiceProvider(
            id: "s4", businessName: "Sparkle Cleaning Services",
            description: "Professional home and office cleaning. Deep cleaning, carpet cleaning, and regular maintenance services.",
            category: "Cleaning", subCategories: ["Home Cleaning", "Office Cleaning", "Carpet Cleaning"],
            owner: User(id: "u4", name: "Mary Njeri", email: "mary@sparkleclean.co.ke", phone: "+254745678901", role: .serviceProvider, avatar: "https://i.pravatar.cc/150?img=30", verified: true, subscriptionTier: nil, rewardPoints: 0, followersCount: nil, followingCount: nil, trustScore: .sample(), paymentReliability: nil, blacklisted: nil),
            location: GeoLocation(address: "Lavington", city: "Nairobi", country: "Kenya", lat: -1.2821, lng: 36.7673),
            images: ["https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800",
                     "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=800"],
            services: [
                ServiceItem(id: "sv10", name: "Home Deep Cleaning", description: "Thorough cleaning of entire home", price: 8000, currency: "KSh", duration: 4, durationUnit: "hours"),
                ServiceItem(id: "sv11", name: "Office Cleaning", description: "Professional office space cleaning", price: 5000, currency: "KSh", duration: 2, durationUnit: "hours"),
                ServiceItem(id: "sv12", name: "Carpet & Upholstery Cleaning", description: "Deep clean carpets and furniture", price: 4000, currency: "KSh", duration: 2, durationUnit: "hours"),
            ],
            workingHours: fullWeekHours(),
            rating: 4.8, reviewsCount: 104, followersCount: 312, boosted: true, subscriptionTier: .monthly
        ),
    ]

    // MARK: Posts

    static let posts: [Post] = [
        Post(id: "po1", authorId: "a1", authorName: "Sarah Mutua", authorAvatar: "https://i.pravatar.cc/150?img=5", authorRole: .agent, type: "post",
             content: "Just listed! Beautiful 3BR apartment in Kilimani with modern amenities. Perfect for families looking for comfort and convenience. DM for viewings! 🏠✨",
             media: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"],
             hashtags: ["Kilimani", "NairobiHomes", "RealEstate"], likes: 67, commentsCount: 12, sharesCount: 8, createdAt: "2025-10-24T14:30:00Z"),
        Post(id: "po2", authorId: "s2", authorName: "Elite Event Planners", authorAvatar: "https://i.pravatar.cc/150?img=20", authorRole: .serviceProvider, type: "reel",
             content: "Highlights from last weekend's magical wedding at Karen Country Club! 💍✨ Every detail was perfection.",
             media: ["https://images.unsplash.com/photo-1519167758481-83f29da8170d?w=800",
                     "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800"],
             hashtags: ["WeddingKE", "EventPlanning", "KarenWeddings"], likes: 234, commentsCount: 45, sharesCount: 32, createdAt: "2025-10-23T10:15:00Z"),
        Post(id: "po3", authorId: "a2", authorName: "John Kamau", authorAvatar: "https://i.pravatar.cc/150?img=8", authorRole: .agent, type: "post",
             content: "Prime 1/4 acre plot in Ruiru now available! Perfect location for your dream home. Title deed ready, all utilities connected. Serious buyers only.",
             media: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"],
             hashtags: ["LandForSale", "Ruiru", "Investment"], likes: 89, commentsCount: 23, sharesCount: 15, createdAt: "2025-10-22T16:45:00Z"),
        Post(id: "po4", authorId: "s4", authorName: "Sparkle Cleaning Services", authorAvatar: "https://i.pravatar.cc/150?img=30", authorRole: .serviceProvider, type: "post",
             content: "🎉 Special October Offer! Get 20% off on deep cleaning services. Book now and enjoy a sparkling clean home! Limited slots available.",
             media: ["https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800"],
             hashtags: ["CleaningServices", "Nairobi", "HomeClean"], likes: 156, commentsCount: 34, sharesCount: 21, createdAt: "2025-10-21T09:00:00Z"),
        Post(id: "po5", authorId: "s1", authorName: "Swift Plumbing Services", authorAvatar: "https://i.pravatar.cc/150?img=15", authorRole: .serviceProvider, type: "post",
             content: "Emergency plumbing? We're available 24/7! Fixed a major leak in Lavington this morning. Fast, reliable, and affordable service. 🔧💧",
             media: [], hashtags: ["PlumbingKE", "Emergency", "Nairobi"], likes: 43, commentsCount: 8, sharesCount: 5, createdAt: "2025-10-20T12:20:00Z"),
    ]

    // MARK: Bookings

    static let bookings: [Booking] = [
        Booking(id: "b1", type: "service", propertyId: nil, serviceProviderId: "s1", eventId: nil, userId: "u10", userName: "James Ochieng", date: "2025-10-28T10:00:00Z", checkIn: nil, checkOut: nil, timeSlot: "10:00 AM - 12:00 PM", status: .confirmed, totalAmount: 3000, currency: "KSh", bookingRef: "BK-10281000"),
        Booking(id: "b2", type: "property", propertyId: "p1", serviceProviderId: nil, eventId: nil, userId: "u10", userName: "James Ochieng", date: "2025-10-30T14:00:00Z", checkIn: "2025-11-01", checkOut: nil, timeSlot: nil, status: .pending, totalAmount: 85000, currency: "KSh", bookingRef: "BK-10301400"),
        Booking(id: "b3", type: "service", propertyId: nil, serviceProviderId: "s4", eventId: nil, userId: "u10", userName: "James Ochieng", date: "2025-11-02T09:00:00Z", checkIn: nil, checkOut: nil, timeSlot: "09:00 AM - 01:00 PM", status: .confirmed, totalAmount: 8000, currency: "KSh", bookingRef: "BK-11020900"),
    ]

    // MARK: Conversations

    static let conversations: [Conversation] = [
        Conversation(id: "c1", participantName: "Sarah Mutua", participantAvatar: "https://i.pravatar.cc/150?img=5", lastMessage: "The apartment is available for viewing this weekend.", unreadCount: 2, timestamp: "10:24 AM", online: true),
        Conversation(id: "c2", participantName: "Swift Plumbing", participantAvatar: "https://i.pravatar.cc/150?img=15", lastMessage: "Our technician will arrive at 10 AM.", unreadCount: 0, timestamp: "Yesterday", online: false),
        Conversation(id: "c3", participantName: "John Kamau", participantAvatar: "https://i.pravatar.cc/150?img=8", lastMessage: "The title deed is ready for transfer.", unreadCount: 1, timestamp: "Mon", online: true),
    ]

    static func messages(for conversationId: String) -> [ChatMessage] {
        [
            ChatMessage(id: "m1", senderId: "other", content: "Hi! Thanks for your interest in the Kilimani apartment.", createdAt: "10:00 AM", read: true, isMine: false),
            ChatMessage(id: "m2", senderId: "u10", content: "Great! Is it still available for this weekend?", createdAt: "10:05 AM", read: true, isMine: true),
            ChatMessage(id: "m3", senderId: "other", content: "Yes it is. I can arrange a viewing on Saturday at 11 AM.", createdAt: "10:20 AM", read: true, isMine: false),
            ChatMessage(id: "m4", senderId: "other", content: "The apartment is available for viewing this weekend.", createdAt: "10:24 AM", read: false, isMine: false),
        ]
    }

    // MARK: Invoices

    static let invoices: [RentInvoice] = [
        RentInvoice(id: "inv1", tenantName: "James Ochieng", propertyTitle: "3BR Apartment, Kilimani", amount: 85000, currency: "KSh", dueDate: "2026-07-01", paidAmount: 85000, lateFee: 0, status: "paid"),
        RentInvoice(id: "inv2", tenantName: "Alice Wambui", propertyTitle: "2BR Bungalow, Ngong", amount: 45000, currency: "KSh", dueDate: "2026-06-05", paidAmount: 20000, lateFee: 2000, status: "partial"),
        RentInvoice(id: "inv3", tenantName: "Brian Kiprop", propertyTitle: "Studio, CBD", amount: 35000, currency: "KSh", dueDate: "2026-05-28", paidAmount: 0, lateFee: 3500, status: "overdue"),
    ]

    // MARK: Events

    static let events: [AppEvent] = [
        AppEvent(id: "e1", title: "Nairobi Tech Summit 2026", description: "The largest gathering of tech innovators in East Africa. Keynotes, workshops, and networking.", category: "conference", venue: "KICC", city: "Nairobi", startDate: "2026-07-15T09:00:00Z", price: 5000, currency: "KSh", capacity: 1000, booked: 742, image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800", organizerName: "TechKE"),
        AppEvent(id: "e2", title: "Digital Marketing Masterclass", description: "Hands-on training on growth marketing, SEO, and social media strategy.", category: "training", venue: "Sarit Centre", city: "Nairobi", startDate: "2026-06-28T10:00:00Z", price: 3500, currency: "KSh", capacity: 120, booked: 98, image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800", organizerName: "GrowthLab"),
        AppEvent(id: "e3", title: "Sunday Worship Conference", description: "A day of worship, fellowship, and inspiration.", category: "religious", venue: "Nyayo Stadium", city: "Nairobi", startDate: "2026-07-05T08:00:00Z", price: 0, currency: "KSh", capacity: 5000, booked: 3200, image: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800", organizerName: "Faith Center"),
    ]

    // MARK: Subscription Plans

    static let subscriptionPlans: [SubscriptionPlan] = [
        SubscriptionPlan(tier: .weekly, category: "boost", price: 500, period: "week", currency: "KSh", features: ["Listing boost for 7 days", "Priority in search", "Featured badge"], highlighted: false),
        SubscriptionPlan(tier: .monthly, category: "boost", price: 1500, period: "month", currency: "KSh", features: ["Everything in Weekly", "Unlimited listings", "Analytics dashboard", "Trust score boost", "Verified badge"], highlighted: true),
        SubscriptionPlan(tier: .yearly, category: "boost", price: 15000, period: "year", currency: "KSh", features: ["Everything in Monthly", "2 months free", "Dedicated support", "Priority verification", "AI pricing insights"], highlighted: false),
    ]

    // MARK: Helpers

    static func weekdayHours(open: String, close: String, satOpen: String, satClose: String) -> WorkingHours {
        let wd = DayHours(open: open, close: close, closed: false)
        return WorkingHours(monday: wd, tuesday: wd, wednesday: wd, thursday: wd, friday: wd,
                            saturday: DayHours(open: satOpen, close: satClose, closed: false),
                            sunday: DayHours(open: "00:00", close: "00:00", closed: true))
    }

    static func fullWeekHours() -> WorkingHours {
        let wd = DayHours(open: "07:00", close: "19:00", closed: false)
        return WorkingHours(monday: wd, tuesday: wd, wednesday: wd, thursday: wd, friday: wd,
                            saturday: DayHours(open: "08:00", close: "16:00", closed: false),
                            sunday: DayHours(open: "09:00", close: "14:00", closed: false))
    }

    static func property(id: String?) -> Property? { properties.first { $0.id == id } }
    static func provider(id: String?) -> ServiceProvider? { serviceProviders.first { $0.id == id } }
}
