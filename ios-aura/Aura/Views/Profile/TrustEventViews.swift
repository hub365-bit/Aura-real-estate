import SwiftUI

// MARK: - Agreements

struct AgreementsView: View {
    private let agreements = [
        ("Rental Agreement", "3BR Apartment, Kilimani", "signed", Theme.success),
        ("Service Contract", "Deep Cleaning - Sparkle", "pending", Theme.warning),
        ("Booking Terms", "Tour - Maasai Mara Safari", "signed", Theme.success),
    ]

    var body: some View {
        ScrollView {
            VStack(spacing: 14) {
                ForEach(agreements, id: \.0) { agreement in
                    NavigationLink(value: agreement.0) {
                        agreementCard(agreement)
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding()
        }
        .background(Theme.background)
        .navigationTitle("Agreements")
        .navigationBarTitleDisplayMode(.inline)
        .navigationDestination(for: String.self) { AgreementDetailView(title: $0) }
    }

    private func agreementCard(_ a: (String, String, String, Color)) -> some View {
        HStack(spacing: 12) {
            Image(systemName: "doc.text.fill")
                .font(.title2).foregroundStyle(.white)
                .frame(width: 48, height: 48)
                .background(Theme.primary.gradient).clipShape(.rect(cornerRadius: 12))
            VStack(alignment: .leading, spacing: 3) {
                Text(a.0).font(.subheadline.weight(.semibold))
                Text(a.1).font(.caption).foregroundStyle(Theme.textSecondary).lineLimit(1)
            }
            Spacer()
            Text(a.2.capitalized)
                .font(.caption.weight(.bold)).foregroundStyle(a.3)
                .padding(.horizontal, 10).padding(.vertical, 4)
                .background(a.3.opacity(0.12)).clipShape(Capsule())
        }
        .auraCard()
    }
}

struct AgreementDetailView: View {
    let title: String
    @State private var signed = false

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                Text(title).font(.title2.weight(.bold))
                Text("This agreement is made between the parties listed below and is legally binding upon electronic signature. Timestamped and immutable, stored securely in your Aura dashboard.")
                    .font(.subheadline).foregroundStyle(Theme.textSecondary)

                VStack(alignment: .leading, spacing: 10) {
                    Text("Parties").font(.headline)
                    partyRow("Sarah Mutua", "Landlord", true)
                    Divider()
                    partyRow("James Ochieng", "Tenant", signed)
                }
                .auraCard()

                VStack(alignment: .leading, spacing: 8) {
                    Text("Terms").font(.headline)
                    ForEach(["Monthly rent: KSh 85,000", "Lease duration: 12 months", "Deposit: 2 months rent", "Notice period: 60 days"], id: \.self) {
                        Label($0, systemImage: "checkmark.circle.fill")
                            .font(.subheadline).foregroundStyle(Theme.textSecondary)
                    }
                }
                .auraCard()

                if !signed {
                    Button { withAnimation { signed = true } } label: {
                        Label("Sign Agreement", systemImage: "signature")
                            .font(.headline).foregroundStyle(.white)
                            .frame(maxWidth: .infinity).padding()
                            .background(Theme.primary).clipShape(.rect(cornerRadius: 14))
                    }
                } else {
                    HStack {
                        Image(systemName: "checkmark.seal.fill").foregroundStyle(Theme.success)
                        Text("Signed · \(Date.now.formatted(date: .abbreviated, time: .shortened))")
                            .font(.subheadline).foregroundStyle(Theme.success)
                        Spacer()
                        Button { } label: { Image(systemName: "square.and.arrow.down") }
                    }
                    .auraCard()
                }
            }
            .padding()
        }
        .background(Theme.background)
        .navigationTitle("Agreement")
        .navigationBarTitleDisplayMode(.inline)
    }

    private func partyRow(_ name: String, _ role: String, _ isSigned: Bool) -> some View {
        HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text(name).font(.subheadline.weight(.medium))
                Text(role).font(.caption).foregroundStyle(Theme.textSecondary)
            }
            Spacer()
            if isSigned {
                Label("Signed", systemImage: "checkmark.circle.fill").font(.caption).foregroundStyle(Theme.success)
            } else {
                Text("Awaiting").font(.caption).foregroundStyle(Theme.warning)
            }
        }
    }
}

// MARK: - Events & Tickets

struct EventsView: View {
    var body: some View {
        ScrollView {
            VStack(spacing: 14) {
                ForEach(MockData.events) { event in
                    NavigationLink(value: event) {
                        eventCard(event)
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding()
        }
        .background(Theme.background)
        .navigationTitle("Events")
        .navigationBarTitleDisplayMode(.inline)
        .navigationDestination(for: AppEvent.self) { EventDetailView(event: $0) }
    }

    private func eventCard(_ event: AppEvent) -> some View {
        VStack(alignment: .leading, spacing: 0) {
            RemoteImage(url: event.image, height: 150)
                .clipShape(.rect(topLeadingRadius: Theme.cardRadius, topTrailingRadius: Theme.cardRadius))
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    Text(event.category.capitalized)
                        .font(.caption2.weight(.bold)).foregroundStyle(Theme.accent)
                        .padding(.horizontal, 8).padding(.vertical, 3)
                        .background(Theme.accent.opacity(0.12)).clipShape(Capsule())
                    Spacer()
                    Text(event.price == 0 ? "Free" : "KSh \(event.price.formatted())")
                        .font(.subheadline.weight(.bold)).foregroundStyle(Theme.primary)
                }
                Text(event.title).font(.headline)
                Label("\(event.venue), \(event.city)", systemImage: "mappin.circle.fill")
                    .font(.caption).foregroundStyle(Theme.textSecondary)
                ProgressView(value: Double(event.booked), total: Double(event.capacity))
                    .tint(Theme.success)
                Text("\(event.booked)/\(event.capacity) booked").font(.caption2).foregroundStyle(Theme.textSecondary)
            }
            .padding(12)
        }
        .background(Theme.surface)
        .clipShape(.rect(cornerRadius: Theme.cardRadius))
        .shadow(color: Theme.cardShadow, radius: 6, y: 3)
    }
}

struct EventDetailView: View {
    let event: AppEvent
    @State private var showTicket = false

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                RemoteImage(url: event.image, height: 220)
                VStack(alignment: .leading, spacing: 14) {
                    Text(event.title).font(.title2.weight(.bold))
                    Label("\(event.venue), \(event.city)", systemImage: "mappin.circle.fill")
                        .font(.subheadline).foregroundStyle(Theme.textSecondary)
                    Label("Organized by \(event.organizerName)", systemImage: "person.fill")
                        .font(.subheadline).foregroundStyle(Theme.textSecondary)
                    Text(event.description).font(.subheadline).foregroundStyle(Theme.textSecondary)
                }
                .padding(.horizontal)
            }
            .padding(.bottom, 100)
        }
        .background(Theme.background)
        .ignoresSafeArea(edges: .top)
        .overlay(alignment: .bottom) {
            Button { showTicket = true } label: {
                Text(event.price == 0 ? "Get Free Ticket" : "Buy Ticket · KSh \(event.price.formatted())")
                    .font(.headline).foregroundStyle(.white)
                    .frame(maxWidth: .infinity).frame(height: 52)
                    .background(Theme.primary).clipShape(.rect(cornerRadius: 14))
            }
            .padding()
            .background(.ultraThinMaterial)
        }
        .navigationBarTitleDisplayMode(.inline)
        .sheet(isPresented: $showTicket) { TicketView(event: event) }
    }
}

struct TicketView: View {
    let event: AppEvent
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            VStack(spacing: 20) {
                Spacer()
                VStack(spacing: 16) {
                    Text(event.title).font(.headline).multilineTextAlignment(.center)
                    Image(systemName: "qrcode")
                        .resizable().scaledToFit()
                        .frame(width: 180, height: 180)
                        .foregroundStyle(Theme.textPrimary)
                    Text("TKT-\(event.id.uppercased())-2026").font(.system(.subheadline, design: .monospaced))
                    Divider()
                    HStack {
                        VStack(alignment: .leading) {
                            Text("Venue").font(.caption).foregroundStyle(Theme.textSecondary)
                            Text(event.venue).font(.subheadline.weight(.semibold))
                        }
                        Spacer()
                        VStack(alignment: .trailing) {
                            Text("Status").font(.caption).foregroundStyle(Theme.textSecondary)
                            Text("Valid").font(.subheadline.weight(.semibold)).foregroundStyle(Theme.success)
                        }
                    }
                }
                .padding(24)
                .background(Theme.surface)
                .clipShape(.rect(cornerRadius: 20))
                .padding()
                Text("Show this QR code at the entrance for attendance tracking.")
                    .font(.caption).foregroundStyle(Theme.textSecondary).multilineTextAlignment(.center)
                Spacer()
            }
            .background(Theme.background)
            .navigationTitle("Your Ticket")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar { ToolbarItem(placement: .confirmationAction) { Button("Done") { dismiss() } } }
        }
    }
}

// MARK: - Trust Score

struct TrustScoreView: View {
    @Environment(AppState.self) private var app

    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                if let t = app.currentUser.trustScore {
                    VStack(spacing: 10) {
                        ZStack {
                            Circle().stroke(Theme.success.opacity(0.2), lineWidth: 12)
                            Circle().trim(from: 0, to: Double(t.score) / 100)
                                .stroke(Theme.success, style: StrokeStyle(lineWidth: 12, lineCap: .round))
                                .rotationEffect(.degrees(-90))
                            VStack {
                                Text("\(t.score)").font(.system(size: 40, weight: .bold))
                                Text("/ 100").font(.caption).foregroundStyle(Theme.textSecondary)
                            }
                        }
                        .frame(width: 160, height: 160)
                        TrustBadge(level: t.level)
                    }
                    .padding(.vertical, 8)

                    VStack(alignment: .leading, spacing: 12) {
                        Text("Score Factors").font(.headline)
                        factorRow("ID Verified", t.verifiedId)
                        factorRow("Business Verified", t.verifiedBusiness)
                        scoreRow("Completed Bookings", "\(t.completedBookings)")
                        scoreRow("Avg Response Time", "\(t.avgResponseTime) min")
                        scoreRow("Cancellation Rate", "\(Int(t.cancellationRate * 100))%")
                        scoreRow("Disputes", "\(t.disputeCount)")
                    }
                    .auraCard()
                }

                VStack(alignment: .leading, spacing: 8) {
                    Label("Trust Levels", systemImage: "info.circle").font(.headline)
                    levelRow(.verified, "High trust, full visibility, badge shown")
                    levelRow(.building, "New / building reputation, limited boost")
                    levelRow(.restricted, "Reduced visibility, admin review required")
                }
                .auraCard()
            }
            .padding()
        }
        .background(Theme.background)
        .navigationTitle("Trust & Safety")
        .navigationBarTitleDisplayMode(.inline)
    }

    private func factorRow(_ title: String, _ ok: Bool) -> some View {
        HStack {
            Text(title).font(.subheadline)
            Spacer()
            Image(systemName: ok ? "checkmark.circle.fill" : "xmark.circle.fill")
                .foregroundStyle(ok ? Theme.success : Theme.error)
        }
    }

    private func scoreRow(_ title: String, _ value: String) -> some View {
        HStack {
            Text(title).font(.subheadline)
            Spacer()
            Text(value).font(.subheadline.weight(.semibold)).foregroundStyle(Theme.textSecondary)
        }
    }

    private func levelRow(_ level: TrustLevel, _ desc: String) -> some View {
        HStack(alignment: .top, spacing: 10) {
            TrustBadge(level: level, compact: true)
                .frame(width: 28)
            VStack(alignment: .leading, spacing: 2) {
                Text(level.label).font(.subheadline.weight(.medium))
                Text(desc).font(.caption).foregroundStyle(Theme.textSecondary)
            }
        }
    }
}

// MARK: - Admin Dashboard

struct AdminDashboardView: View {
    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                    adminStat("2,341", "Users", "person.3.fill", Theme.primary)
                    adminStat("486", "Listings", "house.fill", Theme.accent)
                    adminStat("KSh 4.2M", "GMV", "chart.line.uptrend.xyaxis", Theme.success)
                    adminStat("12", "Disputes", "exclamationmark.triangle.fill", Theme.warning)
                }

                VStack(alignment: .leading, spacing: 12) {
                    Text("Pending Reviews").font(.headline)
                    adminRow("Business verification - QuickFix", "Review")
                    Divider()
                    adminRow("Dispute - Booking BK-10301400", "Mediate")
                    Divider()
                    adminRow("Trust override - Studio CBD", "Approve")
                }
                .auraCard()

                VStack(alignment: .leading, spacing: 12) {
                    Text("Platform Health").font(.headline)
                    healthRow("Booking conversion", 0.68, Theme.success)
                    healthRow("Trust score average", 0.84, Theme.primary)
                    healthRow("Dispute rate", 0.05, Theme.warning)
                }
                .auraCard()
            }
            .padding()
        }
        .background(Theme.background)
        .navigationTitle("Admin")
        .navigationBarTitleDisplayMode(.inline)
    }

    private func adminStat(_ value: String, _ label: String, _ icon: String, _ color: Color) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Image(systemName: icon).font(.title3).foregroundStyle(color)
            Text(value).font(.title3.weight(.bold))
            Text(label).font(.caption).foregroundStyle(Theme.textSecondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .auraCard()
    }

    private func adminRow(_ title: String, _ action: String) -> some View {
        HStack {
            Text(title).font(.subheadline).lineLimit(1)
            Spacer()
            Button(action) {}
                .font(.caption.weight(.bold)).foregroundStyle(.white)
                .padding(.horizontal, 12).padding(.vertical, 6)
                .background(Theme.primary).clipShape(Capsule())
        }
    }

    private func healthRow(_ title: String, _ value: Double, _ color: Color) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack {
                Text(title).font(.caption)
                Spacer()
                Text("\(Int(value * 100))%").font(.caption.weight(.bold))
            }
            ProgressView(value: value).tint(color)
        }
    }
}
