import SwiftUI

// MARK: - Compare

struct CompareView: View {
    @Environment(AppState.self) private var app
    @State private var selected: [Property] = []

    private var compareProperties: [Property] {
        if selected.isEmpty {
            return Array(MockData.properties.prefix(2))
        }
        return selected
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                Text("Compare up to 3 properties side by side.")
                    .font(.subheadline)
                    .foregroundStyle(Theme.textSecondary)
                    .padding(.horizontal)

                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(alignment: .top, spacing: 12) {
                        ForEach(compareProperties) { p in
                            compareColumn(p)
                        }
                    }
                    .padding(.horizontal)
                }
            }
            .padding(.vertical)
        }
        .background(Theme.background)
        .navigationTitle("Compare")
        .navigationBarTitleDisplayMode(.inline)
    }

    private func compareColumn(_ p: Property) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            RemoteImage(url: p.images.first, height: 120)
                .clipShape(.rect(cornerRadius: 12))
            Text(p.title).font(.subheadline.weight(.semibold)).lineLimit(2)
            compareRow("Price", p.formattedPrice)
            compareRow("Type", p.propertyType.rawValue.capitalized)
            compareRow("Beds", p.bedrooms.map(String.init) ?? "-")
            compareRow("Baths", p.bathrooms.map(String.init) ?? "-")
            compareRow("Area", p.area.map { "\($0) \(p.areaUnit ?? "")" } ?? "-")
            compareRow("Rating", String(format: "%.1f", p.rating))
            compareRow("City", p.location.city)
        }
        .frame(width: 200)
        .auraCard()
    }

    private func compareRow(_ label: String, _ value: String) -> some View {
        HStack {
            Text(label).font(.caption).foregroundStyle(Theme.textSecondary)
            Spacer()
            Text(value).font(.caption.weight(.medium))
        }
    }
}

// MARK: - Saved Searches

struct SavedSearchesView: View {
    @State private var searches: [SavedSearchRow] = [
        SavedSearchRow(name: "Apartments in Kilimani", detail: "Rental · Under KSh 100k", alerts: true),
        SavedSearchRow(name: "Land for Sale Ruiru", detail: "Sale · 1/4 acre", alerts: false),
        SavedSearchRow(name: "Office Westlands", detail: "Rental · Commercial", alerts: true),
    ]

    var body: some View {
        List {
            ForEach($searches) { $search in
                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        Text(search.name).font(.subheadline.weight(.semibold))
                        Text(search.detail).font(.caption).foregroundStyle(Theme.textSecondary)
                    }
                    Spacer()
                    Toggle("", isOn: $search.alerts)
                        .labelsHidden()
                        .tint(Theme.primary)
                }
            }
            .onDelete { searches.remove(atOffsets: $0) }
        }
        .navigationTitle("Saved Searches")
        .navigationBarTitleDisplayMode(.inline)
    }
}

struct SavedSearchRow: Identifiable {
    let id = UUID()
    var name: String
    var detail: String
    var alerts: Bool
}

// MARK: - Swipe (Tinder-style)

struct PropertySwipeView: View {
    @Environment(AppState.self) private var app
    @State private var index = 0
    @State private var offset: CGSize = .zero

    private var deck: [Property] { MockData.properties }

    var body: some View {
        VStack {
            ZStack {
                ForEach(Array(deck.enumerated().reversed()), id: \.element.id) { i, property in
                    if i >= index, i < index + 3 {
                        swipeCard(property)
                            .offset(i == index ? offset : .zero)
                            .rotationEffect(.degrees(i == index ? Double(offset.width / 20) : 0))
                            .scaleEffect(i == index ? 1 : 0.95 - CGFloat(i - index) * 0.02)
                            .gesture(i == index ? dragGesture(property) : nil)
                            .animation(.spring, value: offset)
                    }
                }
                if index >= deck.count {
                    EmptyStateView(icon: "checkmark.circle", title: "All done!", message: "You've reviewed all available properties.")
                }
            }
            .padding()

            if index < deck.count {
                HStack(spacing: 40) {
                    Button { swipe(left: true) } label: {
                        Image(systemName: "xmark")
                            .font(.title2.weight(.bold))
                            .foregroundStyle(Theme.error)
                            .frame(width: 64, height: 64)
                            .background(Theme.surface, in: Circle())
                            .shadow(color: Theme.cardShadow, radius: 6)
                    }
                    Button { swipe(left: false) } label: {
                        Image(systemName: "heart.fill")
                            .font(.title2)
                            .foregroundStyle(.white)
                            .frame(width: 64, height: 64)
                            .background(Theme.accent, in: Circle())
                            .shadow(color: Theme.accent.opacity(0.4), radius: 8)
                    }
                }
                .padding(.bottom, 24)
            }
        }
        .background(Theme.background)
        .navigationTitle("Discover")
        .navigationBarTitleDisplayMode(.inline)
    }

    private func swipeCard(_ property: Property) -> some View {
        VStack(alignment: .leading, spacing: 0) {
            RemoteImage(url: property.images.first, height: 360)
            VStack(alignment: .leading, spacing: 6) {
                Text(property.formattedPrice).font(.title3.weight(.bold)).foregroundStyle(Theme.primary)
                Text(property.title).font(.headline).lineLimit(1)
                Text("\(property.location.address), \(property.location.city)")
                    .font(.subheadline).foregroundStyle(Theme.textSecondary)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding()
        }
        .background(Theme.surface)
        .clipShape(.rect(cornerRadius: 20))
        .shadow(color: Theme.cardShadow, radius: 10, y: 4)
    }

    private func dragGesture(_ property: Property) -> some Gesture {
        DragGesture()
            .onChanged { offset = $0.translation }
            .onEnded { value in
                if abs(value.translation.width) > 120 {
                    if value.translation.width > 0 { app.toggleFavorite(property.id) }
                    offset = CGSize(width: value.translation.width > 0 ? 600 : -600, height: 0)
                    advance()
                } else {
                    offset = .zero
                }
            }
    }

    private func swipe(left: Bool) {
        if !left, index < deck.count { app.toggleFavorite(deck[index].id) }
        offset = CGSize(width: left ? -600 : 600, height: 0)
        advance()
    }

    private func advance() {
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.25) {
            index += 1
            offset = .zero
        }
    }
}
