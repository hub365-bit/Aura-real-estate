import SwiftUI

struct DiscoverView: View {
    @Environment(AppState.self) private var app
    @State private var searchText = ""
    @State private var category: ListingCategory? = nil
    @State private var showFilters = false
    @State private var showVoice = false
    @State private var filters = PropertyFilters()

    private let columns = [GridItem(.flexible(), spacing: 12), GridItem(.flexible(), spacing: 12)]

    private var filtered: [Property] {
        MockData.properties.filter { p in
            (category == nil || p.category == category) &&
            (searchText.isEmpty || p.title.localizedCaseInsensitiveContains(searchText) || p.location.city.localizedCaseInsensitiveContains(searchText)) &&
            filters.matches(p)
        }
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    AuraSearchBar(text: $searchText, placeholder: "Search homes, areas...", showVoice: true) {
                        showVoice = true
                    }
                    .padding(.horizontal)

                    // Quick shortcuts
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 10) {
                            NavigationLink(value: DiscoverRoute.tourism) {
                                shortcut("Tourism", "airplane", Theme.accent)
                            }
                            NavigationLink(value: DiscoverRoute.compare) {
                                shortcut("Compare", "rectangle.on.rectangle", Theme.primary)
                            }
                            NavigationLink(value: DiscoverRoute.savedSearches) {
                                shortcut("Saved", "bell.badge", Theme.secondary)
                            }
                            NavigationLink(value: DiscoverRoute.swipe) {
                                shortcut("Swipe", "hand.draw", Theme.info)
                            }
                        }
                        .padding(.horizontal)
                    }

                    // Category chips
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 10) {
                            FilterChip(title: "All", isSelected: category == nil) { category = nil }
                            FilterChip(title: "For Rent", isSelected: category == .rental) { category = .rental }
                            FilterChip(title: "For Sale", isSelected: category == .sale) { category = .sale }
                            Button { showFilters = true } label: {
                                HStack(spacing: 6) {
                                    Image(systemName: "slider.horizontal.3")
                                    Text("Filters")
                                }
                                .font(.subheadline.weight(.medium))
                                .foregroundStyle(Theme.primary)
                                .padding(.horizontal, 16).padding(.vertical, 9)
                                .overlay(Capsule().stroke(Theme.primary, lineWidth: 1))
                            }
                        }
                        .padding(.horizontal)
                    }

                    if filtered.isEmpty {
                        EmptyStateView(icon: "house", title: "No properties found", message: "Try adjusting your search or filters.")
                    } else {
                        LazyVGrid(columns: columns, spacing: 12) {
                            ForEach(filtered) { property in
                                NavigationLink(value: DiscoverRoute.property(property)) {
                                    PropertyCard(property: property, isFavorite: app.isFavorite(property.id)) {
                                        app.toggleFavorite(property.id)
                                    }
                                }
                                .buttonStyle(.plain)
                            }
                        }
                        .padding(.horizontal)
                    }
                }
                .padding(.vertical)
            }
            .background(Theme.background)
            .navigationTitle("Discover")
            .navigationDestination(for: DiscoverRoute.self) { route in
                switch route {
                case .property(let p): PropertyDetailView(property: p)
                case .tourism: TourismHubView()
                case .compare: CompareView()
                case .savedSearches: SavedSearchesView()
                case .swipe: PropertySwipeView()
                }
            }
            .sheet(isPresented: $showFilters) {
                FilterSheet(filters: $filters)
            }
            .sheet(isPresented: $showVoice) {
                VoiceSearchSheet(searchText: $searchText)
            }
        }
    }

    private func shortcut(_ title: String, _ icon: String, _ color: Color) -> some View {
        VStack(spacing: 6) {
            Image(systemName: icon)
                .font(.title3)
                .foregroundStyle(.white)
                .frame(width: 52, height: 52)
                .background(color.gradient)
                .clipShape(.rect(cornerRadius: 14))
            Text(title)
                .font(.caption)
                .foregroundStyle(Theme.textPrimary)
        }
    }
}

enum DiscoverRoute: Hashable {
    case property(Property)
    case tourism
    case compare
    case savedSearches
    case swipe
}

struct PropertyFilters: Equatable {
    var minPrice: Double = 0
    var maxPrice: Double = 500000
    var bedrooms: Int = 0
    var propertyType: PropertyType? = nil

    func matches(_ p: Property) -> Bool {
        Double(p.price) >= minPrice && Double(p.price) <= maxPrice &&
        (bedrooms == 0 || (p.bedrooms ?? 0) >= bedrooms) &&
        (propertyType == nil || p.propertyType == propertyType)
    }
}

struct FilterSheet: View {
    @Binding var filters: PropertyFilters
    @Environment(\.dismiss) private var dismiss
    @State private var working = PropertyFilters()

    private let types: [PropertyType] = [.house, .apartment, .office, .land, .commercial]

    var body: some View {
        NavigationStack {
            Form {
                Section("Price Range (KSh)") {
                    VStack(alignment: .leading) {
                        Text("Max: \(Int(working.maxPrice).formatted())")
                            .font(.subheadline)
                        Slider(value: $working.maxPrice, in: 30000...500000, step: 5000)
                            .tint(Theme.primary)
                    }
                }
                Section("Bedrooms") {
                    Picker("Minimum", selection: $working.bedrooms) {
                        Text("Any").tag(0)
                        ForEach(1..<6) { Text("\($0)+").tag($0) }
                    }
                    .pickerStyle(.segmented)
                }
                Section("Property Type") {
                    Picker("Type", selection: $working.propertyType) {
                        Text("Any").tag(PropertyType?.none)
                        ForEach(types, id: \.self) { t in
                            Text(t.rawValue.capitalized).tag(PropertyType?.some(t))
                        }
                    }
                }
            }
            .navigationTitle("Filters")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Reset") { working = PropertyFilters() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Apply") { filters = working; dismiss() }
                }
            }
            .onAppear { working = filters }
        }
    }
}

struct VoiceSearchSheet: View {
    @Binding var searchText: String
    @Environment(\.dismiss) private var dismiss
    @State private var pulse = false

    var body: some View {
        VStack(spacing: 24) {
            Spacer()
            ZStack {
                Circle().fill(Theme.primary.opacity(0.15))
                    .frame(width: 160, height: 160)
                    .scaleEffect(pulse ? 1.2 : 0.9)
                    .animation(.easeInOut(duration: 1).repeatForever(autoreverses: true), value: pulse)
                Image(systemName: "mic.fill")
                    .font(.system(size: 48))
                    .foregroundStyle(Theme.primary)
            }
            Text("Listening...")
                .font(.title3.weight(.semibold))
            Text("Try \"3 bedroom in Kilimani under 100k\"")
                .font(.subheadline)
                .foregroundStyle(Theme.textSecondary)
            Spacer()
            Button {
                searchText = "Kilimani"
                dismiss()
            } label: {
                Text("Use Sample Result")
                    .font(.headline)
                    .foregroundStyle(.white)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Theme.primary)
                    .clipShape(.rect(cornerRadius: 14))
            }
            .padding(.horizontal)
        }
        .padding()
        .onAppear { pulse = true }
        .presentationDetents([.medium])
    }
}
