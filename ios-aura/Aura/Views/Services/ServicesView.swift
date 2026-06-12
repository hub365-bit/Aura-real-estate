import SwiftUI

struct ServicesView: View {
    @Environment(AppState.self) private var app
    @State private var searchText = ""

    private var filtered: [ServiceProvider] {
        MockData.serviceProviders.filter {
            searchText.isEmpty ||
            $0.businessName.localizedCaseInsensitiveContains(searchText) ||
            $0.category.localizedCaseInsensitiveContains(searchText)
        }
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 14) {
                    AuraSearchBar(text: $searchText, placeholder: "Search services...")
                        .padding(.horizontal)

                    ForEach(filtered) { provider in
                        NavigationLink(value: provider) {
                            ServiceCard(provider: provider,
                                        isFollowing: app.isFollowing(provider.id)) {
                                app.toggleFollow(provider.id)
                            }
                        }
                        .buttonStyle(.plain)
                        .padding(.horizontal)
                    }
                }
                .padding(.vertical)
            }
            .background(Theme.background)
            .navigationTitle("Services")
            .navigationDestination(for: ServiceProvider.self) { ProviderDetailView(provider: $0) }
        }
    }
}

struct ServiceCard: View {
    let provider: ServiceProvider
    var isFollowing: Bool
    var onFollow: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            ZStack(alignment: .topLeading) {
                RemoteImage(url: provider.images.first, height: 140)
                    .clipShape(.rect(topLeadingRadius: Theme.cardRadius, topTrailingRadius: Theme.cardRadius))
                if provider.boosted {
                    FeaturedBadge().padding(8)
                }
            }
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    VStack(alignment: .leading, spacing: 2) {
                        Text(provider.businessName).font(.headline)
                        Text(provider.category).font(.caption).foregroundStyle(Theme.primary)
                    }
                    Spacer()
                    Button(action: onFollow) {
                        Text(isFollowing ? "Following" : "Follow")
                            .font(.caption.weight(.semibold))
                            .foregroundStyle(isFollowing ? Theme.textSecondary : .white)
                            .padding(.horizontal, 14).padding(.vertical, 7)
                            .background(isFollowing ? AnyShapeStyle(Theme.surface) : AnyShapeStyle(Theme.primary))
                            .overlay(Capsule().stroke(Theme.border, lineWidth: isFollowing ? 1 : 0))
                            .clipShape(Capsule())
                    }
                    .buttonStyle(.plain)
                }
                Text(provider.description)
                    .font(.caption)
                    .foregroundStyle(Theme.textSecondary)
                    .lineLimit(2)
                HStack(spacing: 14) {
                    Label(String(format: "%.1f", provider.rating), systemImage: "star.fill")
                        .foregroundStyle(Theme.secondary)
                    Label("\(provider.reviewsCount)", systemImage: "text.bubble.fill")
                        .foregroundStyle(Theme.textSecondary)
                    Label("\(provider.followersCount)", systemImage: "person.2.fill")
                        .foregroundStyle(Theme.textSecondary)
                }
                .font(.caption)
            }
            .padding(12)
        }
        .background(Theme.surface)
        .clipShape(.rect(cornerRadius: Theme.cardRadius))
        .shadow(color: Theme.cardShadow, radius: 6, x: 0, y: 3)
    }
}

private extension Theme {
    static let border = Color(.separator)
}
