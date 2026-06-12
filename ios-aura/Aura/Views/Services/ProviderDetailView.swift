import SwiftUI

struct ProviderDetailView: View {
    let provider: ServiceProvider
    @Environment(AppState.self) private var app
    @State private var bookingService: ServiceItem?

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                RemoteImage(url: provider.images.first, height: 220)
                VStack(alignment: .leading, spacing: 16) {
                    header
                    Text(provider.description)
                        .font(.subheadline)
                        .foregroundStyle(Theme.textSecondary)
                    servicesSection
                    hoursSection
                }
                .padding(.horizontal)
            }
            .padding(.bottom, 32)
        }
        .background(Theme.background)
        .ignoresSafeArea(edges: .top)
        .navigationBarTitleDisplayMode(.inline)
        .sheet(item: $bookingService) { service in
            ServiceBookingSheet(provider: provider, service: service)
        }
    }

    private var header: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text(provider.businessName).font(.title2.weight(.bold))
                    Text(provider.category).font(.subheadline).foregroundStyle(Theme.primary)
                }
                Spacer()
                Button { app.toggleFollow(provider.id) } label: {
                    Text(app.isFollowing(provider.id) ? "Following" : "Follow")
                        .font(.subheadline.weight(.semibold))
                        .foregroundStyle(app.isFollowing(provider.id) ? Theme.textSecondary : .white)
                        .padding(.horizontal, 16).padding(.vertical, 9)
                        .background(app.isFollowing(provider.id) ? AnyShapeStyle(Theme.surface) : AnyShapeStyle(Theme.primary))
                        .clipShape(Capsule())
                }
            }
            HStack(spacing: 16) {
                Label(String(format: "%.1f", provider.rating), systemImage: "star.fill").foregroundStyle(Theme.secondary)
                Label("\(provider.reviewsCount) reviews", systemImage: "text.bubble").foregroundStyle(Theme.textSecondary)
                if let t = provider.owner.trustScore {
                    TrustBadge(level: t.level, score: t.score)
                }
            }
            .font(.caption)
            HStack(spacing: 4) {
                Image(systemName: "mappin.circle.fill").foregroundStyle(Theme.accent)
                Text("\(provider.location.address), \(provider.location.city)")
                    .font(.subheadline).foregroundStyle(Theme.textSecondary)
            }
        }
    }

    private var servicesSection: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Services").font(.headline)
            ForEach(provider.services) { service in
                HStack {
                    VStack(alignment: .leading, spacing: 3) {
                        Text(service.name).font(.subheadline.weight(.semibold))
                        Text(service.description).font(.caption).foregroundStyle(Theme.textSecondary).lineLimit(1)
                        if let d = service.duration, let u = service.durationUnit {
                            Text("\(d) \(u)").font(.caption2).foregroundStyle(Theme.textSecondary)
                        }
                    }
                    Spacer()
                    VStack(alignment: .trailing, spacing: 6) {
                        Text("\(service.currency) \(service.price.formatted())")
                            .font(.subheadline.weight(.bold))
                            .foregroundStyle(Theme.primary)
                        Button("Book") { bookingService = service }
                            .font(.caption.weight(.semibold))
                            .foregroundStyle(.white)
                            .padding(.horizontal, 14).padding(.vertical, 6)
                            .background(Theme.primary)
                            .clipShape(Capsule())
                    }
                }
                .padding(.vertical, 6)
                if service.id != provider.services.last?.id { Divider() }
            }
        }
        .auraCard()
    }

    private var hoursSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Working Hours").font(.headline)
            ForEach(provider.workingHours.ordered, id: \.0) { day, hours in
                HStack {
                    Text(day).font(.subheadline)
                    Spacer()
                    Text(hours.closed ? "Closed" : "\(hours.open) - \(hours.close)")
                        .font(.subheadline)
                        .foregroundStyle(hours.closed ? Theme.error : Theme.textSecondary)
                }
            }
        }
        .auraCard()
    }
}

struct ServiceBookingSheet: View {
    let provider: ServiceProvider
    let service: ServiceItem
    @Environment(\.dismiss) private var dismiss
    @State private var date = Date()
    @State private var confirmed = false

    var body: some View {
        NavigationStack {
            if confirmed {
                BookingConfirmedView(ref: "BK-\(Int.random(in: 10000...99999))") { dismiss() }
            } else {
                Form {
                    Section("Service") {
                        LabeledContent(service.name, value: "\(service.currency) \(service.price.formatted())")
                    }
                    Section("Schedule") {
                        DatePicker("Date & Time", selection: $date)
                    }
                    Section {
                        HStack {
                            Image(systemName: "lock.shield.fill").foregroundStyle(Theme.success)
                            Text("Payment held in Aura escrow until service is complete.")
                                .font(.caption).foregroundStyle(Theme.textSecondary)
                        }
                    }
                }
                .navigationTitle("Book Service")
                .navigationBarTitleDisplayMode(.inline)
                .toolbar {
                    ToolbarItem(placement: .cancellationAction) { Button("Cancel") { dismiss() } }
                    ToolbarItem(placement: .confirmationAction) {
                        Button("Confirm") { withAnimation { confirmed = true } }
                    }
                }
            }
        }
    }
}
