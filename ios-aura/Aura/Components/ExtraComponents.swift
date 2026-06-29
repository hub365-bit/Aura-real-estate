import SwiftUI

// MARK: - Reusable Components

struct TimeZoneBadge: View {
    let timeZone: String
    @State private var currentTime = Date()

    private var timeDisplay: String {
        let formatter = DateFormatter()
        formatter.timeZone = TimeZone(identifier: timeZone) ?? .current
        formatter.dateFormat = "HH:mm"
        return formatter.string(from: currentTime)
    }

    private var zoneLabel: String {
        let abbr = TimeZone(identifier: timeZone)?.abbreviation() ?? timeZone
        return abbr
    }

    var body: some View {
        HStack(spacing: 5) {
            Image(systemName: "clock").font(.caption2)
            Text("\(zoneLabel) \(timeDisplay)")
                .font(.caption2.weight(.medium))
        }
        .foregroundStyle(Theme.info)
        .padding(.horizontal, 8).padding(.vertical, 4)
        .background(Theme.info.opacity(0.1)).clipShape(Capsule())
        .onAppear { startClock() }
    }

    private func startClock() {
        Timer.scheduledTimer(withTimeInterval: 60, repeats: true) { _ in currentTime = Date() }
    }
}

struct CurrencyConverter: View {
    let amount: Int
    let fromCurrency: String
    let toCurrencies: [String]
    @State private var rates: [String: Double] = [
        "KES": 1.0, "USD": 0.0067, "EUR": 0.0062, "GBP": 0.0053, "TZS": 17.5, "UGX": 25.3
    ]

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("Currency Breakdown").font(.caption).foregroundStyle(Theme.textSecondary)
            ForEach(toCurrencies, id: \.self) { currency in
                HStack {
                    Text(currency).font(.caption.weight(.medium)).frame(width: 36, alignment: .leading)
                    Text(converted(currency)).font(.caption.weight(.bold)).foregroundStyle(Theme.primary)
                    Spacer()
                }
            }
        }
        .padding(10).background(Theme.surface).clipShape(.rect(cornerRadius: 10))
    }

    private func converted(_ currency: String) -> String {
        let rate = rates[currency] ?? 1.0
        let value = Double(amount) * rate
        if value >= 1000 {
            return String(format: "%@ %.1fK", currency == "KES" ? "KSh" : currency, value / 1000)
        }
        return String(format: "%@ %.2f", currency == "KES" ? "KSh" : currency, value)
    }
}

struct OfflineIndicator: View {
    let isOffline: Bool
    let lastSynced: Date?

    var body: some View {
        if isOffline {
            HStack(spacing: 6) {
                Image(systemName: "wifi.slash").font(.caption2)
                Text("Offline").font(.caption2.weight(.medium))
                if let sync = lastSynced {
                    Text("· Last sync \(sync.formatted(.relative(presentation: .named)))").font(.caption2)
                }
            }
            .foregroundStyle(.white).padding(.horizontal, 12).padding(.vertical, 6)
            .background(Theme.warning).clipShape(Capsule())
        }
    }
}

struct MultiCurrencyPriceView: View {
    let amount: Int
    let baseCurrency: String
    @State private var showBreakdown = false

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Button { withAnimation { showBreakdown.toggle() } } label: {
                HStack(spacing: 6) {
                    Text("\(baseCurrency) \(amount.formatted(.number.grouping(.automatic)))")
                        .font(.subheadline.weight(.bold)).foregroundStyle(Theme.primary)
                    Image(systemName: showBreakdown ? "chevron.up" : "chevron.down")
                        .font(.caption2).foregroundStyle(Theme.textSecondary)
                }
            }

            if showBreakdown {
                CurrencyConverter(amount: amount, fromCurrency: baseCurrency, toCurrencies: ["KES", "USD", "EUR", "GBP"])
            }
        }
    }
}

struct GradientFeatureCard: View {
    let title: String
    let subtitle: String
    let icon: String
    let colors: [Color]
    var action: (() -> Void)?

    var body: some View {
        Button { action?() } label: {
            VStack(alignment: .leading, spacing: 8) {
                Image(systemName: icon).font(.title2).foregroundStyle(.white)
                Text(title).font(.headline).foregroundStyle(.white)
                Text(subtitle).font(.caption).foregroundStyle(.white.opacity(0.85)).lineLimit(2)
                Spacer()
            }
            .padding(16)
            .frame(maxWidth: .infinity, alignment: .leading)
            .frame(height: 140)
            .background(LinearGradient(colors: colors, startPoint: .topLeading, endPoint: .bottomTrailing))
            .clipShape(.rect(cornerRadius: Theme.cardRadius))
            .shadow(color: colors.first?.opacity(0.3) ?? .clear, radius: 8, y: 4)
        }
        .buttonStyle(.plain)
    }
}

struct VoiceSearchButton: View {
    let action: () -> Void
    @State private var pulse = false

    var body: some View {
        Button(action: action) {
            ZStack {
                Circle().fill(Theme.primary.opacity(0.12)).frame(width: 40, height: 40)
                    .scaleEffect(pulse ? 1.15 : 1.0)
                    .animation(.easeInOut(duration: 0.8).repeatForever(autoreverses: true), value: pulse)
                Image(systemName: "mic.fill").font(.subheadline).foregroundStyle(Theme.primary)
            }
        }
        .onAppear { pulse = true }
    }
}

struct QualityScoreIndicator: View {
    let score: Int
    let label: String

    private var color: Color {
        if score >= 80 { return Theme.success }
        if score >= 60 { return Theme.warning }
        return Theme.error
    }

    var body: some View {
        HStack(spacing: 6) {
            ZStack {
                Circle().stroke(color.opacity(0.2), lineWidth: 4).frame(width: 32, height: 32)
                Circle().trim(from: 0, to: CGFloat(score) / 100)
                    .stroke(color, style: StrokeStyle(lineWidth: 4, lineCap: .round))
                    .rotationEffect(.degrees(-90)).frame(width: 32, height: 32)
                Text("\(score)").font(.system(size: 10, weight: .bold)).foregroundStyle(color)
            }
            Text(label).font(.caption).foregroundStyle(Theme.textSecondary)
        }
    }
}

struct PriceIntelligenceCard: View {
    let intel: PriceIntelligence

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Label("AI Pricing", systemImage: "brain.head.profile").font(.subheadline.weight(.semibold)).foregroundStyle(Theme.accent)
                Spacer()
                dealLabel(intel.priceLabel)
            }
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text("Suggested: KSh \(intel.suggestedPrice.formatted())").font(.subheadline.weight(.bold)).foregroundStyle(Theme.success)
                    Text("Market avg: KSh \(intel.marketAverage.formatted())").font(.caption).foregroundStyle(Theme.textSecondary)
                }
                Spacer()
                VStack(alignment: .trailing, spacing: 2) {
                    Text(intel.competitiveness.capitalized).font(.caption.weight(.bold)).foregroundStyle(Theme.primary)
                    Text("\(intel.demandLevel.capitalized) demand").font(.caption2).foregroundStyle(Theme.textSecondary)
                }
            }
            Text("Best time: \(intel.bestPostingTime)").font(.caption2).foregroundStyle(Theme.textSecondary)
        }
        .padding(12).background(Theme.surface).clipShape(.rect(cornerRadius: 12))
    }

    private func dealLabel(_ label: String) -> some View {
        let (text, color): (String, Color) = {
            switch label {
            case "great-deal": return ("Great Deal", Theme.success)
            case "overpriced": return ("Overpriced", Theme.error)
            default: return ("Fair Price", Theme.warning)
            }
        }()
        return Text(text).font(.caption.weight(.bold)).foregroundStyle(.white)
            .padding(.horizontal, 8).padding(.vertical, 3).background(color).clipShape(Capsule())
    }
}

struct EmptyStateView2: View {
    let icon: String
    let title: String
    let message: String

    var body: some View {
        VStack(spacing: 12) {
            Image(systemName: icon).font(.system(size: 44)).foregroundStyle(Theme.primary.opacity(0.4))
            Text(title).font(.headline)
            Text(message).font(.subheadline).foregroundStyle(Theme.textSecondary).multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity).padding(40)
    }
}
