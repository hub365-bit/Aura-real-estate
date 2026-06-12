import SwiftUI

// MARK: - Messages List

struct MessagesListView: View {
    var body: some View {
        List {
            ForEach(MockData.conversations) { convo in
                NavigationLink(value: convo) {
                    HStack(spacing: 12) {
                        ZStack(alignment: .bottomTrailing) {
                            Avatar(url: convo.participantAvatar, size: 52)
                            if convo.online {
                                Circle().fill(Theme.success)
                                    .frame(width: 13, height: 13)
                                    .overlay(Circle().stroke(Theme.surface, lineWidth: 2))
                            }
                        }
                        VStack(alignment: .leading, spacing: 3) {
                            Text(convo.participantName).font(.subheadline.weight(.semibold))
                            Text(convo.lastMessage).font(.caption).foregroundStyle(Theme.textSecondary).lineLimit(1)
                        }
                        Spacer()
                        VStack(alignment: .trailing, spacing: 6) {
                            Text(convo.timestamp).font(.caption2).foregroundStyle(Theme.textSecondary)
                            if convo.unreadCount > 0 {
                                Text("\(convo.unreadCount)")
                                    .font(.caption2.weight(.bold)).foregroundStyle(.white)
                                    .frame(minWidth: 18, minHeight: 18)
                                    .background(Theme.accent).clipShape(Circle())
                            }
                        }
                    }
                    .padding(.vertical, 4)
                }
            }
        }
        .navigationTitle("Messages")
        .navigationDestination(for: Conversation.self) { ChatView(participantName: $0.participantName, conversationId: $0.id) }
    }
}

// MARK: - Rewards

struct RewardsView: View {
    @Environment(AppState.self) private var app

    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                VStack(spacing: 8) {
                    Image(systemName: "gift.fill").font(.system(size: 40)).foregroundStyle(.white)
                    Text("\(app.currentUser.rewardPoints)").font(.system(size: 44, weight: .bold)).foregroundStyle(.white)
                    Text("Aura Points").font(.subheadline).foregroundStyle(.white.opacity(0.9))
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, 28)
                .background(Theme.sunsetGradient)
                .clipShape(.rect(cornerRadius: 20))

                VStack(alignment: .leading, spacing: 12) {
                    Text("Redeem Rewards").font(.headline)
                    rewardRow("Free listing boost", "500 pts")
                    rewardRow("KSh 200 booking credit", "1,000 pts")
                    rewardRow("Verified badge (1 month)", "2,000 pts")
                    rewardRow("Premium support", "3,000 pts")
                }
                .auraCard()

                VStack(alignment: .leading, spacing: 12) {
                    Text("Earn More").font(.headline)
                    earnRow("Complete a booking", "+50 pts")
                    earnRow("Leave a review", "+20 pts")
                    earnRow("Refer a friend", "+200 pts")
                }
                .auraCard()
            }
            .padding()
        }
        .background(Theme.background)
        .navigationTitle("Rewards")
        .navigationBarTitleDisplayMode(.inline)
    }

    private func rewardRow(_ title: String, _ cost: String) -> some View {
        HStack {
            Text(title).font(.subheadline)
            Spacer()
            Button(cost) {}
                .font(.caption.weight(.bold)).foregroundStyle(.white)
                .padding(.horizontal, 12).padding(.vertical, 6)
                .background(Theme.primary).clipShape(Capsule())
        }
    }

    private func earnRow(_ title: String, _ pts: String) -> some View {
        HStack {
            Image(systemName: "plus.circle.fill").foregroundStyle(Theme.success)
            Text(title).font(.subheadline)
            Spacer()
            Text(pts).font(.caption.weight(.bold)).foregroundStyle(Theme.success)
        }
    }
}

// MARK: - Referrals

struct ReferralsView: View {
    @State private var copied = false

    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                Image(systemName: "person.2.wave.2.fill").font(.system(size: 50)).foregroundStyle(Theme.primary)
                Text("Refer & Earn").font(.title2.weight(.bold))
                Text("Invite friends to Aura and earn 200 points for each one who joins and completes a booking.")
                    .font(.subheadline).foregroundStyle(Theme.textSecondary).multilineTextAlignment(.center)

                VStack(spacing: 10) {
                    Text("Your referral code").font(.caption).foregroundStyle(Theme.textSecondary)
                    Text("JAMES2026").font(.title.weight(.bold)).foregroundStyle(Theme.primary)
                    Button {
                        copied = true
                    } label: {
                        Label(copied ? "Copied!" : "Copy Code", systemImage: copied ? "checkmark" : "doc.on.doc")
                            .font(.subheadline.weight(.semibold))
                            .foregroundStyle(.white)
                            .frame(maxWidth: .infinity).padding()
                            .background(Theme.primary).clipShape(.rect(cornerRadius: 12))
                    }
                }
                .auraCard()

                HStack {
                    StatItem(value: "3", label: "Invited")
                    StatItem(value: "1", label: "Joined", tint: Theme.success)
                    StatItem(value: "200", label: "Earned", tint: Theme.secondary)
                }
                .auraCard()
            }
            .padding()
        }
        .background(Theme.background)
        .navigationTitle("Refer & Earn")
        .navigationBarTitleDisplayMode(.inline)
    }
}

// MARK: - Support Tickets

struct TicketsView: View {
    private let tickets = [
        ("Repair request - leaking tap", "in_progress", Theme.warning),
        ("Booking refund query", "resolved", Theme.success),
        ("App login issue", "open", Theme.info),
    ]

    var body: some View {
        List {
            ForEach(tickets, id: \.0) { ticket in
                HStack {
                    Image(systemName: "lifepreserver.fill").foregroundStyle(Theme.primary)
                    VStack(alignment: .leading, spacing: 3) {
                        Text(ticket.0).font(.subheadline.weight(.medium))
                        Text(ticket.1.replacingOccurrences(of: "_", with: " ").capitalized)
                            .font(.caption).foregroundStyle(ticket.2)
                    }
                    Spacer()
                    Image(systemName: "chevron.right").font(.caption).foregroundStyle(Theme.textSecondary)
                }
                .padding(.vertical, 4)
            }
        }
        .navigationTitle("Support")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button { } label: { Image(systemName: "plus") }
            }
        }
    }
}

// MARK: - Verification

struct VerificationView: View {
    private let steps = [
        ("National ID", "Verified", true),
        ("Phone number", "Verified", true),
        ("Email address", "Verified", true),
        ("Business documents", "Pending review", false),
    ]

    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                Image(systemName: "checkmark.shield.fill").font(.system(size: 50)).foregroundStyle(Theme.success)
                Text("Account Verification").font(.title3.weight(.bold))
                Text("Complete verification to build trust and unlock premium features.")
                    .font(.subheadline).foregroundStyle(Theme.textSecondary).multilineTextAlignment(.center)

                VStack(spacing: 0) {
                    ForEach(Array(steps.enumerated()), id: \.offset) { idx, step in
                        HStack {
                            Image(systemName: step.2 ? "checkmark.circle.fill" : "clock.fill")
                                .foregroundStyle(step.2 ? Theme.success : Theme.warning)
                            Text(step.0).font(.subheadline)
                            Spacer()
                            Text(step.1).font(.caption).foregroundStyle(step.2 ? Theme.success : Theme.warning)
                        }
                        .padding(.vertical, 12)
                        if idx < steps.count - 1 { Divider() }
                    }
                }
                .auraCard()
            }
            .padding()
        }
        .background(Theme.background)
        .navigationTitle("Verification")
        .navigationBarTitleDisplayMode(.inline)
    }
}

// MARK: - Settings

struct SettingsView: View {
    @Environment(AppState.self) private var app
    @State private var notifications = true
    @State private var biometrics = false

    var body: some View {
        Form {
            Section("Preferences") {
                Toggle("Push Notifications", isOn: $notifications)
                Toggle("Biometric Login", isOn: $biometrics)
                Picker("Currency", selection: Binding(get: { app.preferredCurrency }, set: { app.setCurrency($0) })) {
                    ForEach(["KES", "USD", "EUR", "GBP", "TZS", "UGX"], id: \.self) { Text($0).tag($0) }
                }
            }
            Section("Security") {
                NavigationLink("Trusted Devices") { DevicesView() }
                NavigationLink("Two-Factor Authentication") { TwoFactorView() }
            }
            Section("About") {
                LabeledContent("Version", value: "1.0.0")
                Text("Aura — A unified digital infrastructure for property, hospitality, and tourism in Africa.")
                    .font(.caption).foregroundStyle(Theme.textSecondary)
            }
            Section {
                Button("Sign Out", role: .destructive) {}
            }
        }
        .navigationTitle("Settings")
        .navigationBarTitleDisplayMode(.inline)
    }
}

struct DevicesView: View {
    private let devices = [
        ("iPhone 15 Pro", "This device", true),
        ("iPad Air", "Last used 2 days ago", true),
        ("Web Browser", "Last used 1 week ago", false),
    ]

    var body: some View {
        List {
            Section {
                ForEach(devices, id: \.0) { device in
                    HStack {
                        Image(systemName: "iphone").foregroundStyle(Theme.primary)
                        VStack(alignment: .leading, spacing: 2) {
                            Text(device.0).font(.subheadline.weight(.medium))
                            Text(device.1).font(.caption).foregroundStyle(Theme.textSecondary)
                        }
                        Spacer()
                        if device.2 { Image(systemName: "checkmark.seal.fill").foregroundStyle(Theme.success) }
                    }
                }
            } footer: {
                Text("Up to 3 trusted devices allowed. New devices require OTP and email confirmation.")
            }
        }
        .navigationTitle("Trusted Devices")
        .navigationBarTitleDisplayMode(.inline)
    }
}

struct TwoFactorView: View {
    @State private var enabled = false

    var body: some View {
        Form {
            Section {
                Toggle("Enable 2FA", isOn: $enabled.animation())
            } footer: {
                Text("Add an extra layer of security with one-time passwords sent to your phone.")
            }
            if enabled {
                Section("Backup Codes") {
                    ForEach(["A1B2-C3D4", "E5F6-G7H8", "I9J0-K1L2"], id: \.self) { code in
                        Text(code).font(.system(.body, design: .monospaced))
                    }
                }
            }
        }
        .navigationTitle("Two-Factor Auth")
        .navigationBarTitleDisplayMode(.inline)
    }
}
