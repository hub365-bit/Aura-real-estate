import SwiftUI

struct PropertyDetailView: View {
    let property: Property
    @Environment(AppState.self) private var app
    @State private var imageIndex = 0
    @State private var showBooking = false

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                gallery
                VStack(alignment: .leading, spacing: 16) {
                    header
                    specsRow
                    if let intel = property.priceIntelligence { priceIntelligence(intel) }
                    agentCard
                    featuresSection
                    Text(property.description)
                        .font(.subheadline)
                        .foregroundStyle(Theme.textSecondary)
                    if let n = property.neighborhoodInfo { neighborhood(n) }
                    if let q = property.qualityScore { qualitySection(q) }
                }
                .padding(.horizontal)
            }
            .padding(.bottom, 100)
        }
        .background(Theme.background)
        .ignoresSafeArea(edges: .top)
        .overlay(alignment: .bottom) { bottomBar }
        .navigationBarTitleDisplayMode(.inline)
        .sheet(isPresented: $showBooking) {
            BookingFlowView(property: property)
        }
    }

    private var gallery: some View {
        TabView(selection: $imageIndex) {
            ForEach(Array(property.images.enumerated()), id: \.offset) { idx, url in
                RemoteImage(url: url, height: 300)
                    .tag(idx)
            }
        }
        .frame(height: 300)
        .tabViewStyle(.page)
    }

    private var header: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text(property.formattedPrice)
                    .font(.title.weight(.bold))
                    .foregroundStyle(Theme.primary)
                Spacer()
                if let t = property.trustScore {
                    TrustBadge(level: t.level, score: t.score)
                }
            }
            Text(property.title)
                .font(.title3.weight(.semibold))
            HStack(spacing: 4) {
                Image(systemName: "mappin.circle.fill")
                    .foregroundStyle(Theme.accent)
                Text("\(property.location.address), \(property.location.city)")
                    .font(.subheadline)
                    .foregroundStyle(Theme.textSecondary)
            }
        }
    }

    private var specsRow: some View {
        HStack(spacing: 0) {
            if let bd = property.bedrooms { spec("bed.double.fill", "\(bd)", "Beds") }
            if let ba = property.bathrooms { spec("shower.fill", "\(ba)", "Baths") }
            if let area = property.area { spec("ruler.fill", "\(area)", property.areaUnit ?? "sqft") }
            spec("star.fill", String(format: "%.1f", property.rating), "\(property.reviewsCount) reviews")
        }
        .auraCard()
    }

    private func spec(_ icon: String, _ value: String, _ label: String) -> some View {
        VStack(spacing: 4) {
            Image(systemName: icon).foregroundStyle(Theme.primary)
            Text(value).font(.subheadline.weight(.bold))
            Text(label).font(.caption2).foregroundStyle(Theme.textSecondary)
        }
        .frame(maxWidth: .infinity)
    }

    private func priceIntelligence(_ intel: PriceIntelligence) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            Label("Price Intelligence", systemImage: "brain.head.profile")
                .font(.headline)
                .foregroundStyle(Theme.accent)
            HStack {
                dealBadge(intel.priceLabel)
                Spacer()
                Text("Market avg: KSh \(intel.marketAverage.formatted())")
                    .font(.caption)
                    .foregroundStyle(Theme.textSecondary)
            }
            HStack(spacing: 6) {
                Image(systemName: "clock")
                    .font(.caption)
                Text("Best time to view: \(intel.bestPostingTime) · \(intel.demandLevel.capitalized) demand")
                    .font(.caption)
            }
            .foregroundStyle(Theme.textSecondary)
        }
        .auraCard()
    }

    private func dealBadge(_ label: String) -> some View {
        let (text, color): (String, Color) = {
            switch label {
            case "great-deal": return ("Great Deal", Theme.success)
            case "overpriced": return ("Overpriced", Theme.error)
            default: return ("Fair Price", Theme.warning)
            }
        }()
        return Text(text)
            .font(.caption.weight(.bold))
            .foregroundStyle(.white)
            .padding(.horizontal, 12).padding(.vertical, 6)
            .background(color).clipShape(Capsule())
    }

    private var agentCard: some View {
        HStack(spacing: 12) {
            Avatar(url: property.agentAvatar, size: 48)
            VStack(alignment: .leading, spacing: 2) {
                Text(property.agentName).font(.subheadline.weight(.semibold))
                Text("Listing Agent").font(.caption).foregroundStyle(Theme.textSecondary)
            }
            Spacer()
            NavigationLink(value: DetailRoute.chat(property.agentName)) {
                Image(systemName: "message.fill")
                    .foregroundStyle(.white)
                    .padding(10)
                    .background(Theme.primary)
                    .clipShape(Circle())
            }
        }
        .auraCard()
        .navigationDestination(for: DetailRoute.self) { route in
            switch route {
            case .chat(let name): ChatView(participantName: name, conversationId: "new")
            }
        }
    }

    private var featuresSection: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Features").font(.headline)
            FlowLayout(spacing: 8) {
                ForEach(property.features, id: \.self) { f in
                    Text(f)
                        .font(.caption.weight(.medium))
                        .padding(.horizontal, 12).padding(.vertical, 6)
                        .background(Theme.primary.opacity(0.1))
                        .foregroundStyle(Theme.primary)
                        .clipShape(Capsule())
                }
            }
        }
    }

    private func neighborhood(_ n: NeighborhoodInfo) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            Label("Neighborhood", systemImage: "building.2.fill")
                .font(.headline)
            ForEach(n.schools, id: \.name) { row(icon: "graduationcap.fill", $0.name, "\($0.distance, specifier: "%.1f") km") }
            ForEach(n.hospitals, id: \.name) { row(icon: "cross.case.fill", $0.name, "\($0.distance, specifier: "%.1f") km") }
            ForEach(n.transport, id: \.name) { row(icon: "bus.fill", $0.name, "\($0.distance, specifier: "%.1f") km") }
            HStack {
                Label("Safety \(n.safetyRating, specifier: "%.1f")/5", systemImage: "shield.fill")
                Spacer()
                Text("\(n.noiseLevel.capitalized) noise · \(n.activityLevel.capitalized)")
            }
            .font(.caption)
            .foregroundStyle(Theme.textSecondary)
        }
        .auraCard()
    }

    private func row(icon: String, _ name: String, _ value: String) -> some View {
        HStack {
            Image(systemName: icon).font(.caption).foregroundStyle(Theme.primary).frame(width: 20)
            Text(name).font(.subheadline)
            Spacer()
            Text(value).font(.caption).foregroundStyle(Theme.textSecondary)
        }
    }

    private func qualitySection(_ q: QualityScore) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Label("Listing Quality", systemImage: "checkmark.seal")
                    .font(.headline)
                Spacer()
                Text("\(q.overall)/100")
                    .font(.headline)
                    .foregroundStyle(Theme.success)
            }
            ProgressView(value: Double(q.overall), total: 100)
                .tint(Theme.success)
        }
        .auraCard()
    }

    private var bottomBar: some View {
        HStack(spacing: 12) {
            Button {
                app.toggleFavorite(property.id)
            } label: {
                Image(systemName: app.isFavorite(property.id) ? "heart.fill" : "heart")
                    .font(.title3)
                    .foregroundStyle(app.isFavorite(property.id) ? Theme.accent : Theme.textPrimary)
                    .frame(width: 52, height: 52)
                    .background(Theme.surface)
                    .clipShape(.rect(cornerRadius: 14))
            }
            Button {
                showBooking = true
            } label: {
                Text("Book Viewing")
                    .font(.headline)
                    .foregroundStyle(.white)
                    .frame(maxWidth: .infinity)
                    .frame(height: 52)
                    .background(Theme.primary)
                    .clipShape(.rect(cornerRadius: 14))
            }
        }
        .padding()
        .background(.ultraThinMaterial)
    }
}

enum DetailRoute: Hashable {
    case chat(String)
}

/// Simple flow layout for wrapping chips.
struct FlowLayout: Layout {
    var spacing: CGFloat = 8

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let maxWidth = proposal.width ?? .infinity
        var rows: [[LayoutSubviews.Element]] = [[]]
        var x: CGFloat = 0
        var totalHeight: CGFloat = 0
        var rowHeight: CGFloat = 0
        for sub in subviews {
            let size = sub.sizeThatFits(.unspecified)
            if x + size.width > maxWidth, !rows[rows.count - 1].isEmpty {
                rows.append([])
                totalHeight += rowHeight + spacing
                x = 0
                rowHeight = 0
            }
            rows[rows.count - 1].append(sub)
            x += size.width + spacing
            rowHeight = max(rowHeight, size.height)
        }
        totalHeight += rowHeight
        return CGSize(width: maxWidth, height: totalHeight)
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        var x = bounds.minX
        var y = bounds.minY
        var rowHeight: CGFloat = 0
        for sub in subviews {
            let size = sub.sizeThatFits(.unspecified)
            if x + size.width > bounds.maxX, x > bounds.minX {
                x = bounds.minX
                y += rowHeight + spacing
                rowHeight = 0
            }
            sub.place(at: CGPoint(x: x, y: y), proposal: ProposedViewSize(size))
            x += size.width + spacing
            rowHeight = max(rowHeight, size.height)
        }
    }
}
