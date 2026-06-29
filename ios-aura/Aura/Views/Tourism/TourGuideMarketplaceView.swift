import SwiftUI

// MARK: - Tour Guide Marketplace

struct TourGuideMarketplaceView: View {
    @State private var searchText = ""
    @State private var filterType: GuideFilter = .all

    var guides: [TourGuide] { filterType == .all ? tourGuides : tourGuides.filter { $0.expertise.contains(filterType.rawValue) } }

    var body: some View {
        ScrollView {
            VStack(spacing: 14) {
                AuraSearchBar(text: $searchText, placeholder: "Search tour guides...").padding(.horizontal)
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 10) {
                        ForEach(GuideFilter.allCases, id: \.self) { f in
                            FilterChip(title: f.label, isSelected: filterType == f) { filterType = f }
                        }
                    }
                    .padding(.horizontal)
                }
                LazyVStack(spacing: 12) {
                    ForEach(guides) { guide in guideCard(guide) }
                }
                .padding(.horizontal)
            }
            .padding(.vertical)
        }
        .background(Theme.background)
        .navigationTitle("Tour Guides")
    }

    private func guideCard(_ guide: TourGuide) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack(spacing: 12) {
                Avatar(url: guide.avatar, size: 56)
                VStack(alignment: .leading, spacing: 3) {
                    HStack {
                        Text(guide.name).font(.headline)
                        if guide.verified { Image(systemName: "checkmark.seal.fill").foregroundStyle(Theme.primary).font(.caption) }
                    }
                    Text("\(guide.yearsExperience) years · \(guide.languages.joined(separator: ", "))").font(.caption).foregroundStyle(Theme.textSecondary)
                    TrustBadge(level: guide.trustLevel, score: guide.trustScore, compact: true)
                }
                Spacer()
                VStack(alignment: .trailing, spacing: 4) {
                    Text("\(guide.rating, specifier: "%.1f")").font(.title3.weight(.bold)).foregroundStyle(Theme.secondary)
                    Text("\(guide.reviewCount) reviews").font(.caption2).foregroundStyle(Theme.textSecondary)
                }
            }
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    ForEach(guide.expertise, id: \.self) { exp in
                        Text(exp).font(.caption.weight(.medium)).foregroundStyle(Theme.primary)
                            .padding(.horizontal, 10).padding(.vertical, 5)
                            .background(Theme.primary.opacity(0.1)).clipShape(Capsule())
                    }
                }
            }
            HStack {
                Label("From KSh \(guide.startingPrice)", systemImage: "tag.fill").font(.caption).foregroundStyle(Theme.textSecondary)
                Spacer()
                NavigationLink("Book Tour") {
                    BookingFlowView(forService: guide.name)
                }
                .font(.subheadline.weight(.bold)).foregroundStyle(.white)
                .padding(.horizontal, 16).padding(.vertical, 8)
                .background(Theme.primary).clipShape(Capsule())
            }
        }
        .auraCard()
    }
}

extension BookingFlowView {
    init(forService name: String) {
        self.property = Property(id: "svc", title: name, description: "", category: .service, propertyType: .apartment, price: 0, currency: "KSh", location: GeoLocation(address: "", city: "", country: "", lat: 0, lng: 0), images: [], features: [], bedrooms: nil, bathrooms: nil, area: nil, areaUnit: nil, status: .available, agentId: "", agentName: "", agentAvatar: nil, views: 0, saves: 0, rating: 0, reviewsCount: 0, boosted: false, trustScore: nil, qualityScore: nil, neighborhoodInfo: nil, priceIntelligence: nil)
    }
}

enum GuideFilter: String, CaseIterable {
    case all, safari, city, hiking, cultural, food
    var label: String {
        switch self {
        case .all: return "All"
        case .safari: return "Safari"
        case .city: return "City Tours"
        case .hiking: return "Hiking"
        case .cultural: return "Cultural"
        case .food: return "Food"
        }
    }
}

struct TourGuide: Identifiable {
    let id: String
    var name: String
    var avatar: String?
    var verified: Bool
    var yearsExperience: Int
    var languages: [String]
    var expertise: [String]
    var rating: Double
    var reviewCount: Int
    var trustScore: Int
    var trustLevel: TrustLevel
    var startingPrice: Int
}

private let tourGuides: [TourGuide] = [
    TourGuide(id: "g1", name: "Joseph Mwangi", avatar: "https://i.pravatar.cc/150?img=60", verified: true, yearsExperience: 12, languages: ["English", "Swahili", "Maasai"], expertise: ["Safari", "Cultural", "Wildlife"], rating: 4.9, reviewCount: 203, trustScore: 97, trustLevel: .verified, startingPrice: 5000),
    TourGuide(id: "g2", name: "Faith Wambua", avatar: "https://i.pravatar.cc/150?img=45", verified: true, yearsExperience: 8, languages: ["English", "Swahili"], expertise: ["City Tours", "Food", "Cultural"], rating: 4.7, reviewCount: 156, trustScore: 91, trustLevel: .verified, startingPrice: 3000),
    TourGuide(id: "g3", name: "Daniel Kiprotich", avatar: "https://i.pravatar.cc/150?img=12", verified: true, yearsExperience: 15, languages: ["English", "Swahili", "Kalenjin"], expertise: ["Hiking", "Safari", "Adventure"], rating: 4.8, reviewCount: 189, trustScore: 94, trustLevel: .verified, startingPrice: 4500),
    TourGuide(id: "g4", name: "Amina Hassan", avatar: "https://i.pravatar.cc/150?img=22", verified: true, yearsExperience: 6, languages: ["English", "Swahili", "Arabic"], expertise: ["Cultural", "Food", "City Tours"], rating: 4.6, reviewCount: 98, trustScore: 85, trustLevel: .verified, startingPrice: 2500),
]
