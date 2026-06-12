import Foundation

// MARK: - Enums

enum UserRole: String, Codable, CaseIterable {
    case user, agent, landlord, hotel
    case serviceProvider = "service_provider"
    case admin
    case tourGuide = "tour_guide"
    case tourist

    var label: String {
        switch self {
        case .user: return "User"
        case .agent: return "Agent"
        case .landlord: return "Landlord"
        case .hotel: return "Hotel"
        case .serviceProvider: return "Service Provider"
        case .admin: return "Admin"
        case .tourGuide: return "Tour Guide"
        case .tourist: return "Tourist"
        }
    }
}

enum ListingCategory: String, Codable {
    case rental, sale, hospitality, service
}

enum PropertyType: String, Codable {
    case house, apartment, office, land, commercial
}

enum PropertyStatus: String, Codable {
    case available, rented, sold, pending
}

enum TrustLevel: String, Codable {
    case verified, building, restricted

    var label: String {
        switch self {
        case .verified: return "Verified"
        case .building: return "Building Reputation"
        case .restricted: return "Restricted"
        }
    }
}

enum SubscriptionTier: String, Codable {
    case free, weekly, monthly, yearly
}

// MARK: - Trust & Quality

struct TrustScore: Codable, Hashable {
    var score: Int
    var level: TrustLevel
    var verifiedId: Bool
    var verifiedBusiness: Bool
    var completedBookings: Int
    var avgResponseTime: Int
    var cancellationRate: Double
    var disputeCount: Int
    var lastUpdated: String

    static func sample(_ level: TrustLevel = .verified, score: Int = 92) -> TrustScore {
        TrustScore(score: score, level: level, verifiedId: true, verifiedBusiness: true,
                   completedBookings: 48, avgResponseTime: 12, cancellationRate: 0.03,
                   disputeCount: 0, lastUpdated: "2026-06-01T10:00:00Z")
    }
}

struct QualityScore: Codable, Hashable {
    var overall: Int
    var photoQuality: Int
    var descriptionCompleteness: Int
    var responseSpeed: Int
    var reviewScore: Int
    var suggestions: [String]
}

struct PriceIntelligence: Codable, Hashable {
    var suggestedPrice: Int
    var marketAverage: Int
    var competitiveness: String
    var priceLabel: String   // great-deal, fair-price, overpriced
    var bestPostingTime: String
    var demandLevel: String
}

struct NamedDistance: Codable, Hashable {
    var name: String
    var distance: Double
    var rating: Double?
    var type: String?
}

struct NeighborhoodInfo: Codable, Hashable {
    var schools: [NamedDistance]
    var hospitals: [NamedDistance]
    var transport: [NamedDistance]
    var safetyRating: Double
    var noiseLevel: String
    var activityLevel: String
}

// MARK: - Core

struct GeoLocation: Codable, Hashable {
    var address: String
    var city: String
    var country: String
    var lat: Double
    var lng: Double
}

struct User: Codable, Identifiable, Hashable {
    var id: String
    var name: String
    var email: String
    var phone: String
    var role: UserRole
    var avatar: String?
    var verified: Bool
    var subscriptionTier: SubscriptionTier?
    var rewardPoints: Int
    var followersCount: Int?
    var followingCount: Int?
    var trustScore: TrustScore?
    var paymentReliability: Double?
    var blacklisted: Bool?
}

struct Property: Codable, Identifiable, Hashable {
    var id: String
    var title: String
    var description: String
    var category: ListingCategory
    var propertyType: PropertyType
    var price: Int
    var currency: String
    var location: GeoLocation
    var images: [String]
    var features: [String]
    var bedrooms: Int?
    var bathrooms: Int?
    var area: Int?
    var areaUnit: String?
    var status: PropertyStatus
    var agentId: String
    var agentName: String
    var agentAvatar: String?
    var views: Int
    var saves: Int
    var rating: Double
    var reviewsCount: Int
    var boosted: Bool
    var trustScore: TrustScore?
    var qualityScore: QualityScore?
    var neighborhoodInfo: NeighborhoodInfo?
    var priceIntelligence: PriceIntelligence?

    var formattedPrice: String {
        "\(currency) \(price.formatted(.number.grouping(.automatic)))"
            + (category == .rental ? "/mo" : "")
    }
}

struct ServiceItem: Codable, Identifiable, Hashable {
    var id: String
    var name: String
    var description: String
    var price: Int
    var currency: String
    var duration: Int?
    var durationUnit: String?
}

struct DayHours: Codable, Hashable {
    var open: String
    var close: String
    var closed: Bool
}

struct WorkingHours: Codable, Hashable {
    var monday: DayHours
    var tuesday: DayHours
    var wednesday: DayHours
    var thursday: DayHours
    var friday: DayHours
    var saturday: DayHours
    var sunday: DayHours

    var ordered: [(String, DayHours)] {
        [("Monday", monday), ("Tuesday", tuesday), ("Wednesday", wednesday),
         ("Thursday", thursday), ("Friday", friday), ("Saturday", saturday), ("Sunday", sunday)]
    }
}

struct ServiceProvider: Codable, Identifiable, Hashable {
    var id: String
    var businessName: String
    var description: String
    var category: String
    var subCategories: [String]
    var owner: User
    var location: GeoLocation
    var images: [String]
    var services: [ServiceItem]
    var workingHours: WorkingHours
    var rating: Double
    var reviewsCount: Int
    var followersCount: Int
    var boosted: Bool
    var subscriptionTier: SubscriptionTier?
}

enum BookingStatus: String, Codable {
    case pending, confirmed, cancelled, completed
}

struct Booking: Codable, Identifiable, Hashable {
    var id: String
    var type: String
    var propertyId: String?
    var serviceProviderId: String?
    var eventId: String?
    var userId: String
    var userName: String
    var date: String
    var checkIn: String?
    var checkOut: String?
    var timeSlot: String?
    var status: BookingStatus
    var totalAmount: Int
    var currency: String
    var bookingRef: String
}

struct Post: Codable, Identifiable, Hashable {
    var id: String
    var authorId: String
    var authorName: String
    var authorAvatar: String?
    var authorRole: UserRole
    var type: String   // post, reel
    var content: String
    var media: [String]
    var hashtags: [String]
    var likes: Int
    var commentsCount: Int
    var sharesCount: Int
    var createdAt: String
}

struct Conversation: Codable, Identifiable, Hashable {
    var id: String
    var participantName: String
    var participantAvatar: String?
    var lastMessage: String
    var unreadCount: Int
    var timestamp: String
    var online: Bool
}

struct ChatMessage: Codable, Identifiable, Hashable {
    var id: String
    var senderId: String
    var content: String
    var createdAt: String
    var read: Bool
    var isMine: Bool
}

struct RentInvoice: Codable, Identifiable, Hashable {
    var id: String
    var tenantName: String
    var propertyTitle: String
    var amount: Int
    var currency: String
    var dueDate: String
    var paidAmount: Int
    var lateFee: Int
    var status: String   // unpaid, partial, paid, overdue
}

struct AppEvent: Codable, Identifiable, Hashable {
    var id: String
    var title: String
    var description: String
    var category: String
    var venue: String
    var city: String
    var startDate: String
    var price: Int
    var currency: String
    var capacity: Int
    var booked: Int
    var image: String
    var organizerName: String
}

struct SubscriptionPlan: Identifiable, Hashable {
    var id: String { tier.rawValue + category }
    var tier: SubscriptionTier
    var category: String
    var price: Int
    var period: String
    var currency: String
    var features: [String]
    var highlighted: Bool
}
