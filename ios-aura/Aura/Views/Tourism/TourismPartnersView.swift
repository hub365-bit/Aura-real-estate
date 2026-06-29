import SwiftUI

// MARK: - Tourism Partners

struct TourismPartnersView: View {
    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                VStack(spacing: 6) {
                    Image(systemName: "building.columns.fill").font(.system(size: 44)).foregroundStyle(Theme.primary)
                    Text("Verified Tourism Partners").font(.title3.weight(.bold))
                    Text("Official tourism operators, national parks, museums, and heritage sites partnered with Aura.")
                        .font(.subheadline).foregroundStyle(Theme.textSecondary).multilineTextAlignment(.center)
                }
                .padding()

                VStack(alignment: .leading, spacing: 12) {
                    Text("National Parks").font(.headline)
                    partnerRow("Kenya Wildlife Service", "National parks ticketing", "kws", true, Theme.success)
                    partnerRow("Maasai Mara Reserve", "Entry & camping permits", "mara", true, Theme.primary)
                    partnerRow("Amboseli National Park", "Park fees & guided tours", "amboseli", true, Theme.info)
                }
                .auraCard()
                .padding(.horizontal)

                VStack(alignment: .leading, spacing: 12) {
                    Text("Museums & Heritage").font(.headline)
                    partnerRow("National Museums of Kenya", "Museum & site tickets", "nmk", true, Theme.secondary)
                    partnerRow("Fort Jesus Museum", "Guided heritage tours", "fortjesus", false, Theme.textSecondary)
                }
                .auraCard()
                .padding(.horizontal)

                VStack(alignment: .leading, spacing: 12) {
                    Text("Tourism Operators").font(.headline)
                    partnerRow("Kenya Association of Tour Operators", "Certified tour operators", "kato", true, Theme.accent)
                    partnerRow("Kenya Tourism Board", "Official tourism promotion", "ktb", true, Theme.info)
                }
                .auraCard()
                .padding(.horizontal)

                VStack(alignment: .leading, spacing: 12) {
                    Text("Event Calendars").font(.headline)
                    HStack {
                        VStack(alignment: .leading, spacing: 3) {
                            Text("Rhino Charge 2026").font(.subheadline.weight(.medium))
                            Text("Aug 15 · Kajiado").font(.caption).foregroundStyle(Theme.textSecondary)
                        }
                        Spacer()
                        Image(systemName: "calendar.badge.plus").foregroundStyle(Theme.primary)
                    }
                    Divider()
                    HStack {
                        VStack(alignment: .leading, spacing: 3) {
                            Text("Lamu Cultural Festival").font(.subheadline.weight(.medium))
                            Text("Nov 20-23 · Lamu").font(.caption).foregroundStyle(Theme.textSecondary)
                        }
                        Spacer()
                        Image(systemName: "calendar.badge.plus").foregroundStyle(Theme.primary)
                    }
                }
                .auraCard()
                .padding(.horizontal)
            }
            .padding(.vertical)
        }
        .background(Theme.background)
        .navigationTitle("Partners")
        .navigationBarTitleDisplayMode(.inline)
    }

    private func partnerRow(_ name: String, _ description: String, _ id: String, _ verified: Bool, _ color: Color) -> some View {
        HStack(spacing: 12) {
            RoundedRectangle(cornerRadius: 10).fill(color.opacity(0.12)).frame(width: 44, height: 44)
                .overlay(Image(systemName: "building.2.fill").foregroundStyle(color))
            VStack(alignment: .leading, spacing: 2) {
                HStack(spacing: 4) {
                    Text(name).font(.subheadline.weight(.medium))
                    if verified { Image(systemName: "checkmark.seal.fill").font(.caption).foregroundStyle(Theme.success) }
                }
                Text(description).font(.caption2).foregroundStyle(Theme.textSecondary)
            }
        }
    }
}
