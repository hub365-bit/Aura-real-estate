import SwiftUI

struct PropertyCard: View {
    let property: Property
    var isFavorite: Bool = false
    var onFavorite: (() -> Void)? = nil

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            ZStack(alignment: .topLeading) {
                RemoteImage(url: property.images.first, height: 130)
                    .clipShape(.rect(topLeadingRadius: Theme.cardRadius, topTrailingRadius: Theme.cardRadius))

                if property.boosted {
                    FeaturedBadge()
                        .padding(8)
                }

                if let onFavorite {
                    VStack {
                        HStack {
                            Spacer()
                            Button(action: onFavorite) {
                                Image(systemName: isFavorite ? "heart.fill" : "heart")
                                    .font(.subheadline)
                                    .foregroundStyle(isFavorite ? Theme.accent : .white)
                                    .padding(7)
                                    .background(.black.opacity(0.35), in: Circle())
                            }
                        }
                        Spacer()
                    }
                    .padding(8)
                }
            }

            VStack(alignment: .leading, spacing: 6) {
                Text(property.formattedPrice)
                    .font(.subheadline.weight(.bold))
                    .foregroundStyle(Theme.primary)
                Text(property.title)
                    .font(.footnote.weight(.semibold))
                    .foregroundStyle(Theme.textPrimary)
                    .lineLimit(2)
                HStack(spacing: 4) {
                    Image(systemName: "mappin.circle.fill")
                        .font(.caption2)
                        .foregroundStyle(Theme.textSecondary)
                    Text(property.location.city)
                        .font(.caption2)
                        .foregroundStyle(Theme.textSecondary)
                        .lineLimit(1)
                }
                HStack(spacing: 8) {
                    if let bd = property.bedrooms {
                        specItem("bed.double.fill", "\(bd)")
                    }
                    if let ba = property.bathrooms {
                        specItem("shower.fill", "\(ba)")
                    }
                    Spacer()
                    HStack(spacing: 2) {
                        Image(systemName: "star.fill")
                            .font(.caption2)
                            .foregroundStyle(Theme.secondary)
                        Text(String(format: "%.1f", property.rating))
                            .font(.caption2.weight(.semibold))
                    }
                }
            }
            .padding(10)
        }
        .background(Theme.surface)
        .clipShape(.rect(cornerRadius: Theme.cardRadius))
        .shadow(color: Theme.cardShadow, radius: 6, x: 0, y: 3)
    }

    private func specItem(_ icon: String, _ value: String) -> some View {
        HStack(spacing: 3) {
            Image(systemName: icon)
                .font(.caption2)
            Text(value)
                .font(.caption2)
        }
        .foregroundStyle(Theme.textSecondary)
    }
}
