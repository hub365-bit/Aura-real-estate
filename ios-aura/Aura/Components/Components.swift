import SwiftUI

// MARK: - Trust Badge

struct TrustBadge: View {
    let level: TrustLevel
    var score: Int? = nil
    var compact: Bool = false

    private var color: Color {
        switch level {
        case .verified: return Theme.success
        case .building: return Theme.warning
        case .restricted: return Theme.error
        }
    }

    private var icon: String {
        switch level {
        case .verified: return "checkmark.seal.fill"
        case .building: return "clock.fill"
        case .restricted: return "exclamationmark.triangle.fill"
        }
    }

    var body: some View {
        HStack(spacing: 4) {
            Image(systemName: icon)
                .font(.caption2)
            if !compact {
                Text(level.label)
                    .font(.caption2.weight(.semibold))
            }
            if let score {
                Text("\(score)")
                    .font(.caption2.weight(.bold))
            }
        }
        .foregroundStyle(color)
        .padding(.horizontal, compact ? 6 : 8)
        .padding(.vertical, 4)
        .background(color.opacity(0.12))
        .clipShape(Capsule())
    }
}

// MARK: - Featured Badge

struct FeaturedBadge: View {
    var label: String = "Featured"
    var body: some View {
        HStack(spacing: 4) {
            Image(systemName: "sparkles")
                .font(.caption2)
            Text(label)
                .font(.caption2.weight(.bold))
        }
        .foregroundStyle(.white)
        .padding(.horizontal, 8)
        .padding(.vertical, 4)
        .background(Theme.sunsetGradient)
        .clipShape(Capsule())
    }
}

// MARK: - Search Bar

struct AuraSearchBar: View {
    @Binding var text: String
    var placeholder: String = "Search"
    var showVoice: Bool = false
    var onVoice: (() -> Void)? = nil

    var body: some View {
        HStack(spacing: 10) {
            Image(systemName: "magnifyingglass")
                .foregroundStyle(Theme.textSecondary)
            TextField(placeholder, text: $text)
                .textInputAutocapitalization(.never)
            if !text.isEmpty {
                Button { text = "" } label: {
                    Image(systemName: "xmark.circle.fill")
                        .foregroundStyle(Theme.textSecondary)
                }
            }
            if showVoice {
                Button { onVoice?() } label: {
                    Image(systemName: "mic.fill")
                        .foregroundStyle(Theme.primary)
                }
            }
        }
        .padding(.horizontal, 14)
        .padding(.vertical, 12)
        .background(Theme.surface)
        .clipShape(.rect(cornerRadius: 14))
    }
}

// MARK: - Filter Chip

struct FilterChip: View {
    let title: String
    let isSelected: Bool
    var icon: String? = nil
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 6) {
                if let icon {
                    Image(systemName: icon).font(.caption)
                }
                Text(title)
                    .font(.subheadline.weight(.medium))
            }
            .foregroundStyle(isSelected ? .white : Theme.textPrimary)
            .padding(.horizontal, 16)
            .padding(.vertical, 9)
            .background(isSelected ? AnyShapeStyle(Theme.primary) : AnyShapeStyle(Theme.surface))
            .clipShape(Capsule())
        }
        .buttonStyle(.plain)
    }
}

// MARK: - Stat Pill

struct StatItem: View {
    let value: String
    let label: String
    var tint: Color = Theme.primary

    var body: some View {
        VStack(spacing: 4) {
            Text(value)
                .font(.title3.weight(.bold))
                .foregroundStyle(tint)
            Text(label)
                .font(.caption)
                .foregroundStyle(Theme.textSecondary)
        }
        .frame(maxWidth: .infinity)
    }
}

// MARK: - Remote Image

struct RemoteImage: View {
    let url: String?
    var height: CGFloat? = nil
    var contentMode: ContentMode = .fill

    var body: some View {
        Color(.tertiarySystemFill)
            .frame(maxWidth: .infinity)
            .frame(height: height)
            .overlay {
                if let url, let parsed = URL(string: url) {
                    AsyncImage(url: parsed) { phase in
                        switch phase {
                        case .success(let image):
                            image.resizable().aspectRatio(contentMode: contentMode)
                        case .failure:
                            Image(systemName: "photo")
                                .font(.largeTitle)
                                .foregroundStyle(Theme.textSecondary)
                        case .empty:
                            ProgressView()
                        @unknown default:
                            EmptyView()
                        }
                    }
                    .allowsHitTesting(false)
                } else {
                    Image(systemName: "photo")
                        .font(.largeTitle)
                        .foregroundStyle(Theme.textSecondary)
                }
            }
            .clipped()
    }
}

// MARK: - Avatar

struct Avatar: View {
    let url: String?
    var size: CGFloat = 44

    var body: some View {
        Circle()
            .fill(Theme.primary.opacity(0.15))
            .frame(width: size, height: size)
            .overlay {
                if let url, let parsed = URL(string: url) {
                    AsyncImage(url: parsed) { image in
                        image.resizable().aspectRatio(contentMode: .fill)
                    } placeholder: {
                        Image(systemName: "person.fill")
                            .foregroundStyle(Theme.primary)
                    }
                    .allowsHitTesting(false)
                } else {
                    Image(systemName: "person.fill")
                        .foregroundStyle(Theme.primary)
                }
            }
            .clipShape(Circle())
    }
}

// MARK: - Section Header

struct SectionHeader: View {
    let title: String
    var actionTitle: String? = nil
    var action: (() -> Void)? = nil

    var body: some View {
        HStack {
            Text(title)
                .font(.title3.weight(.bold))
            Spacer()
            if let actionTitle, let action {
                Button(actionTitle, action: action)
                    .font(.subheadline.weight(.medium))
                    .foregroundStyle(Theme.primary)
            }
        }
    }
}

// MARK: - Empty State

struct EmptyStateView: View {
    let icon: String
    let title: String
    let message: String

    var body: some View {
        VStack(spacing: 12) {
            Image(systemName: icon)
                .font(.system(size: 44))
                .foregroundStyle(Theme.primary.opacity(0.5))
            Text(title)
                .font(.headline)
            Text(message)
                .font(.subheadline)
                .foregroundStyle(Theme.textSecondary)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .padding(40)
    }
}

// MARK: - Glass Card modifier (iOS 26 liquid glass with fallback)

struct GlassBackground: ViewModifier {
    func body(content: Content) -> some View {
        if #available(iOS 26.0, *) {
            content.glassEffect(.regular, in: .rect(cornerRadius: Theme.cardRadius))
        } else {
            content
                .background(.ultraThinMaterial)
                .clipShape(.rect(cornerRadius: Theme.cardRadius))
        }
    }
}

extension View {
    func glassCard() -> some View { modifier(GlassBackground()) }
}
