import SwiftUI

// MARK: - Hotels Search

struct HotelSearchView: View {
    @State private var searchText = ""
    @State private var showFilters = false
    @State private var filters = HotelFilters()

    var body: some View {
        ScrollView {
            VStack(spacing: 14) {
                AuraSearchBar(text: $searchText, placeholder: "Search hotels in Kenya...")
                    .padding(.horizontal)

                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 10) {
                        FilterChip(title: "Airport Pickup", isSelected: filters.airportPickup, icon: "airplane") { filters.airportPickup.toggle() }
                        FilterChip(title: "Breakfast", isSelected: filters.breakfast, icon: "cup.and.saucer.fill") { filters.breakfast.toggle() }
                        FilterChip(title: "WiFi", isSelected: filters.wifiGood, icon: "wifi") { filters.wifiGood.toggle() }
                        FilterChip(title: "Backup Power", isSelected: filters.powerBackup, icon: "bolt.fill") { filters.powerBackup.toggle() }
                        FilterChip(title: "Eco-Friendly", isSelected: filters.ecoFriendly, icon: "leaf.fill") { filters.ecoFriendly.toggle() }
                        FilterChip(title: "Family", isSelected: filters.familyFriendly, icon: "figure.2.and.child.holdinghands") { filters.familyFriendly.toggle() }
                        FilterChip(title: "Accessible", isSelected: filters.accessible, icon: "figure.roll") { filters.accessible.toggle() }
                    }
                    .padding(.horizontal)
                }

                // Room tags
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 8) {
                        ForEach(["Ocean View", "Balcony", "Quiet Room", "Honeymoon Suite", "Work-Friendly"], id: \.self) { tag in
                            Text(tag)
                                .font(.caption.weight(.medium))
                                .foregroundStyle(Theme.textSecondary)
                                .padding(.horizontal, 12).padding(.vertical, 6)
                                .background(Theme.surface).clipShape(Capsule())
                        }
                    }
                    .padding(.horizontal)
                }

                LazyVStack(spacing: 12) {
                    ForEach(hotelResults, id: \.id) { hotel in
                        hotelCard(hotel)
                    }
                }
                .padding(.horizontal)
            }
            .padding(.vertical)
        }
        .background(Theme.background)
        .navigationTitle("Hotels")
        .navigationBarTitleDisplayMode(.inline)
    }

    private func hotelCard(_ hotel: HotelResult) -> some View {
        NavigationLink(value: hotel) {
            VStack(alignment: .leading, spacing: 0) {
                RemoteImage(url: hotel.image, height: 160)
                    .clipShape(.rect(topLeadingRadius: 14, topTrailingRadius: 14))
                VStack(alignment: .leading, spacing: 8) {
                    HStack {
                        VStack(alignment: .leading, spacing: 2) {
                            Text(hotel.name).font(.headline)
                            Text(hotel.location).font(.caption).foregroundStyle(Theme.textSecondary)
                        }
                        Spacer()
                        VStack(alignment: .trailing, spacing: 2) {
                            Text("KSh \(hotel.price.formatted())/night").font(.subheadline.weight(.bold)).foregroundStyle(Theme.primary)
                            TrustBadge(level: hotel.trustLevel, score: hotel.trustScore, compact: true)
                        }
                    }
                    HStack(spacing: 12) {
                        Label("\(hotel.rating, specifier: "%.1f")", systemImage: "star.fill").font(.caption).foregroundStyle(Theme.secondary)
                        if hotel.airportPickup { Label("Pickup", systemImage: "airplane").font(.caption2).foregroundStyle(Theme.info) }
                        if hotel.breakfast { Label("Breakfast", systemImage: "cup.and.saucer").font(.caption2).foregroundStyle(Theme.success) }
                    }
                    HStack(spacing: 6) {
                        ForEach(hotel.tags.prefix(3), id: \.self) { tag in
                            Text(tag).font(.caption2).foregroundStyle(Theme.accent)
                                .padding(.horizontal, 8).padding(.vertical, 3)
                                .background(Theme.accent.opacity(0.1)).clipShape(Capsule())
                        }
                    }
                }
                .padding(12)
            }
            .background(Theme.surface).clipShape(.rect(cornerRadius: 14))
            .shadow(color: Theme.cardShadow, radius: 6, y: 3)
        }
        .buttonStyle(.plain)
    }
}

struct HotelFilters {
    var airportPickup = false
    var breakfast = false
    var wifiGood = false
    var powerBackup = false
    var ecoFriendly = false
    var familyFriendly = false
    var accessible = false
}

struct HotelResult: Identifiable, Hashable {
    let id: String
    var name: String
    var location: String
    var price: Int
    var rating: Double
    var image: String
    var tags: [String]
    var airportPickup: Bool
    var breakfast: Bool
    var trustScore: Int
    var trustLevel: TrustLevel
}

private let hotelResults: [HotelResult] = [
    HotelResult(id: "h1", name: "Sarova Stanley", location: "Nairobi CBD", price: 12000, rating: 4.6, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800", tags: ["Ocean View", "Balcony", "Work-Friendly"], airportPickup: true, breakfast: true, trustScore: 92, trustLevel: .verified),
    HotelResult(id: "h2", name: "Diani Reef Beach Resort", location: "Diani, Mombasa", price: 18000, rating: 4.8, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800", tags: ["Ocean View", "Honeymoon Suite"], airportPickup: true, breakfast: true, trustScore: 96, trustLevel: .verified),
    HotelResult(id: "h3", name: "Fairmont The Norfolk", location: "Nairobi", price: 15000, rating: 4.7, image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800", tags: ["Quiet Room", "Work-Friendly", "Balcony"], airportPickup: true, breakfast: false, trustScore: 94, trustLevel: .verified),
    HotelResult(id: "h4", name: "Mara Serena Safari Lodge", location: "Maasai Mara", price: 25000, rating: 4.9, image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800", tags: ["Honeymoon Suite", "Ocean View"], airportPickup: true, breakfast: true, trustScore: 98, trustLevel: .verified),
]
