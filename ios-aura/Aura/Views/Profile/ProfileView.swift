import SwiftUI

struct ProfileView: View {
    @Environment(AppState.self) private var app

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    profileHeader
                    statsGrid
                    subscriptionCard
                    touristModeCard
                    settingsMenu
                }
                .padding()
            }
            .background(Theme.background)
            .navigationTitle("Profile")
            .navigationDestination(for: ProfileRoute.self) { route in
                switch route {
                case .messages: MessagesListView()
                case .rewards: RewardsView()
                case .referrals: ReferralsView()
                case .tickets: TicketsView()
                case .subscription: SubscriptionView()
                case .payments: PaymentsView()
                case .smartBilling: SmartBillingView()
                case .tenantProfile: TenantProfileView()
                case .agreements: AgreementsView()
                case .events: EventsView()
                case .trust: TrustScoreView()
                case .admin: AdminDashboardView()
                case .settings: SettingsView()
                case .verification: VerificationView()
                }
            }
        }
    }

    private var profileHeader: some View {
        VStack(spacing: 10) {
            Avatar(url: app.currentUser.avatar, size: 88)
            HStack(spacing: 6) {
                Text(app.currentUser.name).font(.title2.weight(.bold))
                if app.currentUser.verified {
                    Image(systemName: "checkmark.seal.fill").foregroundStyle(Theme.primary)
                }
            }
            Text(app.currentUser.email).font(.subheadline).foregroundStyle(Theme.textSecondary)
            HStack(spacing: 8) {
                Text(app.currentUser.role.label)
                    .font(.caption.weight(.semibold))
                    .padding(.horizontal, 12).padding(.vertical, 5)
                    .background(Theme.primary.opacity(0.12))
                    .foregroundStyle(Theme.primary)
                    .clipShape(Capsule())
                if let t = app.currentUser.trustScore {
                    TrustBadge(level: t.level, score: t.score)
                }
            }
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 8)
    }

    private var statsGrid: some View {
        HStack {
            StatItem(value: "\(app.favoriteIds.count)", label: "Saved", tint: Theme.accent)
            Divider().frame(height: 32)
            StatItem(value: "\(MockData.bookings.count)", label: "Bookings")
            Divider().frame(height: 32)
            StatItem(value: "12", label: "Reviews", tint: Theme.secondary)
            Divider().frame(height: 32)
            StatItem(value: "\(app.currentUser.rewardPoints)", label: "Points", tint: Theme.success)
        }
        .auraCard()
    }

    private var subscriptionCard: some View {
        NavigationLink(value: ProfileRoute.subscription) {
            HStack {
                Image(systemName: "crown.fill")
                    .font(.title2)
                    .foregroundStyle(.white)
                    .frame(width: 48, height: 48)
                    .background(Theme.sunsetGradient)
                    .clipShape(.rect(cornerRadius: 12))
                VStack(alignment: .leading, spacing: 2) {
                    Text("Upgrade to Aura Pro").font(.subheadline.weight(.bold))
                    Text("Boost listings, get verified, unlock AI insights")
                        .font(.caption).foregroundStyle(Theme.textSecondary).lineLimit(2)
                }
                Spacer()
                Image(systemName: "chevron.right").foregroundStyle(Theme.textSecondary)
            }
            .auraCard()
        }
        .buttonStyle(.plain)
    }

    private var touristModeCard: some View {
        @Bindable var bindable = app
        return HStack {
            Image(systemName: "airplane.circle.fill")
                .font(.title2)
                .foregroundStyle(Theme.accent)
            VStack(alignment: .leading, spacing: 2) {
                Text("Tourist Mode").font(.subheadline.weight(.semibold))
                Text("Hotels, tours & travel planning").font(.caption).foregroundStyle(Theme.textSecondary)
            }
            Spacer()
            Toggle("", isOn: Binding(get: { app.touristMode }, set: { app.setTouristMode($0) }))
                .labelsHidden()
                .tint(Theme.accent)
        }
        .auraCard()
    }

    private var settingsMenu: some View {
        VStack(spacing: 0) {
            menuRow(.messages, "message.fill", "Messages", Theme.primary)
            Divider().padding(.leading, 52)
            menuRow(.trust, "shield.checkerboard", "Trust & Safety", Theme.success)
            Divider().padding(.leading, 52)
            menuRow(.smartBilling, "doc.text.fill", "Smart Billing", Theme.info)
            Divider().padding(.leading, 52)
            menuRow(.payments, "creditcard.fill", "Payments", Theme.primary)
            Divider().padding(.leading, 52)
            menuRow(.tenantProfile, "person.text.rectangle.fill", "Tenant Profile", Theme.secondary)
            Divider().padding(.leading, 52)
            menuRow(.agreements, "signature", "Agreements", Theme.accent)
            Divider().padding(.leading, 52)
            menuRow(.events, "ticket.fill", "Events & Tickets", Theme.warning)
            Divider().padding(.leading, 52)
            menuRow(.rewards, "gift.fill", "Rewards", Theme.accent)
            Divider().padding(.leading, 52)
            menuRow(.referrals, "person.2.fill", "Refer & Earn", Theme.success)
            Divider().padding(.leading, 52)
            menuRow(.tickets, "lifepreserver.fill", "Support Tickets", Theme.info)
            Divider().padding(.leading, 52)
            menuRow(.verification, "checkmark.shield.fill", "Verification", Theme.primary)
            Divider().padding(.leading, 52)
            menuRow(.admin, "chart.bar.fill", "Admin Dashboard", Theme.textSecondary)
            Divider().padding(.leading, 52)
            menuRow(.settings, "gearshape.fill", "Settings", Theme.textSecondary)
        }
        .background(Theme.surface)
        .clipShape(.rect(cornerRadius: Theme.cardRadius))
    }

    private func menuRow(_ route: ProfileRoute, _ icon: String, _ title: String, _ color: Color) -> some View {
        NavigationLink(value: route) {
            HStack(spacing: 14) {
                Image(systemName: icon)
                    .font(.subheadline)
                    .foregroundStyle(color)
                    .frame(width: 24)
                Text(title).font(.subheadline).foregroundStyle(Theme.textPrimary)
                Spacer()
                Image(systemName: "chevron.right").font(.caption).foregroundStyle(Theme.textSecondary)
            }
            .padding(.horizontal, 14).padding(.vertical, 13)
        }
        .buttonStyle(.plain)
    }
}

enum ProfileRoute: Hashable {
    case messages, rewards, referrals, tickets, subscription, payments
    case smartBilling, tenantProfile, agreements, events, trust, admin, settings, verification
}
