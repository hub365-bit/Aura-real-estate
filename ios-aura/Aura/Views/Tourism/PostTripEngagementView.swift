import SwiftUI

// MARK: - Post-Trip Engagement

struct PostTripEngagementView: View {
    @State private var selectedTab = 0

    var body: some View {
        VStack(spacing: 0) {
            Picker("Tab", selection: $selectedTab) {
                Text("Reviews").tag(0)
                Text("Rewards").tag(1)
                Text("Journal").tag(2)
            }
            .pickerStyle(.segmented)
            .padding()

            TabView(selection: $selectedTab) {
                reviewsTab.tag(0)
                rewardsTab.tag(1)
                journalTab.tag(2)
            }
            .tabViewStyle(.page(indexDisplayMode: .never))
        }
        .background(Theme.background)
        .navigationTitle("Post-Trip")
        .navigationBarTitleDisplayMode(.inline)
    }

    private var reviewsTab: some View {
        ScrollView {
            VStack(spacing: 14) {
                VStack(spacing: 8) {
                    Image(systemName: "star.bubble.fill").font(.system(size: 40)).foregroundStyle(Theme.secondary)
                    Text("Share your experience").font(.headline)
                    Text("Your reviews help other travelers make informed decisions.")
                        .font(.subheadline).foregroundStyle(Theme.textSecondary).multilineTextAlignment(.center)
                }
                .padding()

                VStack(spacing: 10) {
                    reviewPrompt("Sarova Stanley", "Nairobi", "Jun 2026")
                    reviewPrompt("Maasai Mara Safari", "3-Day Tour", "Jun 2026")
                    reviewPrompt("Diani Reef Resort", "Diani Beach", "May 2026")
                }
                .padding(.horizontal)
            }
        }
    }

    private var rewardsTab: some View {
        ScrollView {
            VStack(spacing: 16) {
                VStack(spacing: 6) {
                    Image(systemName: "gift.fill").font(.system(size: 44)).foregroundStyle(.white)
                    Text("2,450").font(.system(size: 40, weight: .bold)).foregroundStyle(.white)
                    Text("Aura Travel Points").font(.subheadline).foregroundStyle(.white.opacity(0.9))
                }
                .frame(maxWidth: .infinity).padding(.vertical, 28)
                .background(Theme.sunsetGradient).clipShape(.rect(cornerRadius: 20))
                .padding(.horizontal)

                VStack(alignment: .leading, spacing: 12) {
                    Text("Recent Earnings").font(.headline)
                    rewardRow("Completed stay at Sarova", "+500 pts")
                    rewardRow("Left a review", "+50 pts")
                    rewardRow("Referred a friend", "+200 pts")
                }
                .auraCard().padding(.horizontal)

                VStack(alignment: .leading, spacing: 12) {
                    Text("Redeem").font(.headline)
                    rewardRow("KSh 200 booking credit", "1,000 pts")
                    rewardRow("Free airport transfer", "2,000 pts")
                    rewardRow("Lounge access (JKIA)", "3,000 pts")
                }
                .auraCard().padding(.horizontal)
            }
            .padding(.vertical)
        }
    }

    private var journalTab: some View {
        ScrollView {
            VStack(spacing: 14) {
                VStack(spacing: 8) {
                    Image(systemName: "book.fill").font(.system(size: 40)).foregroundStyle(Theme.primary)
                    Text("Travel Journal").font(.headline)
                    Text("Capture your memories — places visited, photos, and notes from your journey.")
                        .font(.subheadline).foregroundStyle(Theme.textSecondary).multilineTextAlignment(.center)
                }
                .padding()

                VStack(spacing: 12) {
                    journalEntry("Kenya Adventure 2026", "Nairobi · Diani · Maasai Mara", 12, "Jun 2026")
                    journalEntry("Lamu Island Escape", "Lamu · Manda Island", 8, "May 2026")
                }
                .padding(.horizontal)
            }
        }
    }

    private func reviewPrompt(_ place: String, _ location: String, _ date: String) -> some View {
        HStack {
            VStack(alignment: .leading, spacing: 3) {
                Text(place).font(.subheadline.weight(.semibold))
                Text("\(location) · \(date)").font(.caption).foregroundStyle(Theme.textSecondary)
            }
            Spacer()
            Button("Write Review") {}.font(.caption.weight(.bold)).foregroundStyle(.white)
                .padding(.horizontal, 14).padding(.vertical, 8)
                .background(Theme.primary).clipShape(Capsule())
        }
        .padding()
        .background(Theme.surface).clipShape(.rect(cornerRadius: 12))
    }

    private func rewardRow(_ title: String, _ pts: String) -> some View {
        HStack {
            Text(title).font(.subheadline)
            Spacer()
            Text(pts).font(.caption.weight(.bold)).foregroundStyle(Theme.success)
        }
    }

    private func journalEntry(_ title: String, _ subtitle: String, _ entries: Int, _ date: String) -> some View {
        HStack(spacing: 12) {
            RoundedRectangle(cornerRadius: 10).fill(Theme.primary.opacity(0.12)).frame(width: 48, height: 48)
                .overlay(Image(systemName: "book.pages.fill").foregroundStyle(Theme.primary))
            VStack(alignment: .leading, spacing: 2) {
                Text(title).font(.subheadline.weight(.semibold))
                Text(subtitle).font(.caption).foregroundStyle(Theme.textSecondary)
            }
            Spacer()
            VStack(alignment: .trailing, spacing: 2) {
                Text("\(entries) entries").font(.caption2).foregroundStyle(Theme.textSecondary)
                Text(date).font(.caption2).foregroundStyle(Theme.textSecondary)
            }
        }
        .padding()
        .background(Theme.surface).clipShape(.rect(cornerRadius: 12))
    }
}
