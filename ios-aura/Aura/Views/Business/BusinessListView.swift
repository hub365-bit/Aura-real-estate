import SwiftUI

// MARK: - Business Listings

struct BusinessListView: View {
    @State private var searchText = ""
    @State private var selectedCategory: String? = nil

    private let categories = ["All", "Restaurants", "Retail", "Health", "Beauty", "Automotive", "Education"]
    private let businesses: [Business] = [
        Business(id: "b1", name: "Java House Coffee", category: "Restaurants", location: "Kilimani, Nairobi", rating: 4.5, reviewCount: 234, image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800", priceRange: "KSh 500-2,000", openStatus: "Open · Until 10 PM", verified: true),
        Business(id: "b2", name: "Naivas Supermarket", category: "Retail", location: "Ngong Road, Nairobi", rating: 4.3, reviewCount: 567, image: "https://images.unsplash.com/photo-1534723328310-ea879edc8288?w=800", priceRange: "Varies", openStatus: "Open · 24/7", verified: true),
        Business(id: "b3", name: "AAR Healthcare", category: "Health", location: "Westlands, Nairobi", rating: 4.7, reviewCount: 189, image: "https://images.unsplash.com/photo-1632833239869-a37e7a580a39?w=800", priceRange: "Consultation KSh 2,500", openStatus: "Open · 24/7", verified: true),
        Business(id: "b4", name: "Sizzler's Grill House", category: "Restaurants", location: "Lavington, Nairobi", rating: 4.4, reviewCount: 312, image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800", priceRange: "KSh 800-3,500", openStatus: "Open · Until 11 PM", verified: true),
        Business(id: "b5", name: "AutoXpress", category: "Automotive", location: "Mombasa Road, Nairobi", rating: 4.6, reviewCount: 98, image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800", priceRange: "Service from KSh 3,000", openStatus: "Open · Until 6 PM", verified: true),
    ]

    private var filtered: [Business] {
        var results = businesses
        if let cat = selectedCategory, cat != "All" { results = results.filter { $0.category == cat } }
        if !searchText.isEmpty { results = results.filter { $0.name.localizedCaseInsensitiveContains(searchText) || $0.location.localizedCaseInsensitiveContains(searchText) } }
        return results
    }

    var body: some View {
        ScrollView {
            VStack(spacing: 14) {
                AuraSearchBar(text: $searchText, placeholder: "Search businesses...").padding(.horizontal)

                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 10) {
                        ForEach(categories, id: \.self) { cat in
                            FilterChip(title: cat, isSelected: (selectedCategory ?? "All") == cat) { selectedCategory = cat }
                        }
                    }
                    .padding(.horizontal)
                }

                LazyVStack(spacing: 12) {
                    ForEach(filtered) { biz in businessCard(biz) }
                }
                .padding(.horizontal)
            }
            .padding(.vertical)
        }
        .background(Theme.background)
        .navigationTitle("Businesses")
        .navigationBarTitleDisplayMode(.inline)
    }

    private func businessCard(_ biz: Business) -> some View {
        VStack(alignment: .leading, spacing: 0) {
            ZStack(alignment: .topTrailing) {
                RemoteImage(url: biz.image, height: 140)
                    .clipShape(.rect(topLeadingRadius: 14, topTrailingRadius: 14))
                if biz.verified {
                    Image(systemName: "checkmark.seal.fill").foregroundStyle(Theme.success)
                        .font(.callout).padding(8)
                }
            }
            VStack(alignment: .leading, spacing: 6) {
                HStack {
                    Text(biz.name).font(.headline)
                    Spacer()
                    HStack(spacing: 2) {
                        Image(systemName: "star.fill").font(.caption2).foregroundStyle(Theme.secondary)
                        Text("\(biz.rating, specifier: "%.1f")").font(.caption.weight(.medium))
                    }
                }
                Text(biz.category).font(.caption.weight(.medium)).foregroundStyle(Theme.primary)
                    .padding(.horizontal, 8).padding(.vertical, 2).background(Theme.primary.opacity(0.08)).clipShape(Capsule())
                Label(biz.location, systemImage: "mappin").font(.caption).foregroundStyle(Theme.textSecondary)
                HStack {
                    Text(biz.openStatus).font(.caption2).foregroundStyle(Theme.success)
                    Spacer()
                    Text(biz.priceRange).font(.caption2).foregroundStyle(Theme.textSecondary)
                }
            }
            .padding(12)
        }
        .background(Theme.surface).clipShape(.rect(cornerRadius: 14))
        .shadow(color: Theme.cardShadow, radius: 6, y: 3)
    }
}

struct Business: Identifiable {
    let id: String
    var name: String
    var category: String
    var location: String
    var rating: Double
    var reviewCount: Int
    var image: String
    var priceRange: String
    var openStatus: String
    var verified: Bool
}
