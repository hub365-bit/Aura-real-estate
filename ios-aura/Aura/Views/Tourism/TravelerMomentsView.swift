import SwiftUI

// MARK: - Traveler Moments

struct TravelerMomentsView: View {
    @State private var likedMoments: Set<String> = []
    @State private var selectedFilter: MomentFilter = .all

    private let moments: [TravelerMoment] = [
        TravelerMoment(id: "tm1", author: "Emily R.", location: "Diani Beach", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800", caption: "Paradise found! Best beach in Kenya 🌊", likes: 234, verified: true, category: "beach"),
        TravelerMoment(id: "tm2", author: "Carlos M.", location: "Maasai Mara", image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800", caption: "Sunrise safari — lions at dawn 🦁", likes: 512, verified: true, category: "safari"),
        TravelerMoment(id: "tm3", author: "Aisha K.", location: "Lamu", image: "https://images.unsplash.com/photo-1590080669911-7a48d4b47669?w=800", caption: "The cultural heart of the coast", likes: 189, verified: false, category: "cultural"),
        TravelerMoment(id: "tm4", author: "James T.", location: "Mount Kenya", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800", caption: "Reached Point Lenana at sunrise!", likes: 421, verified: true, category: "hiking"),
    ]

    private var filtered: [TravelerMoment] {
        selectedFilter == .all ? moments : moments.filter { $0.category == selectedFilter.rawValue }
    }

    var body: some View {
        ScrollView {
            VStack(spacing: 14) {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 10) {
                        ForEach(MomentFilter.allCases, id: \.self) { f in
                            FilterChip(title: f.label, isSelected: selectedFilter == f) { selectedFilter = f }
                        }
                    }
                    .padding(.horizontal)
                }

                LazyVGrid(columns: [GridItem(.flexible(), spacing: 10), GridItem(.flexible(), spacing: 10)], spacing: 10) {
                    ForEach(filtered) { moment in momentCard(moment) }
                }
                .padding(.horizontal)
            }
            .padding(.vertical)
        }
        .background(Theme.background)
        .navigationTitle("Traveler Moments")
        .navigationBarTitleDisplayMode(.inline)
    }

    private func momentCard(_ moment: TravelerMoment) -> some View {
        VStack(alignment: .leading, spacing: 0) {
            ZStack(alignment: .bottomLeading) {
                RemoteImage(url: moment.image, height: 180)
                    .clipShape(.rect(cornerRadius: 14))
                VStack(alignment: .leading, spacing: 4) {
                    HStack {
                        Text(moment.author).font(.caption.weight(.bold)).foregroundStyle(.white)
                        if moment.verified {
                            Image(systemName: "checkmark.seal.fill").font(.caption2).foregroundStyle(Theme.success)
                        }
                    }
                    Text(moment.location).font(.caption2).foregroundStyle(.white.opacity(0.8))
                }
                .padding(10)
                .background(LinearGradient(colors: [.clear, .black.opacity(0.6)], startPoint: .top, endPoint: .bottom))
                .clipShape(.rect(bottomLeadingRadius: 14, bottomTrailingRadius: 14))
            }
            VStack(alignment: .leading, spacing: 4) {
                Text(moment.caption).font(.caption).foregroundStyle(Theme.textSecondary).lineLimit(2)
                HStack {
                    Button { toggleLike(moment.id) } label: {
                        Image(systemName: likedMoments.contains(moment.id) ? "heart.fill" : "heart")
                            .font(.caption).foregroundStyle(likedMoments.contains(moment.id) ? Theme.accent : Theme.textSecondary)
                    }
                    Text("\(moment.likes + (likedMoments.contains(moment.id) ? 1 : 0))").font(.caption2).foregroundStyle(Theme.textSecondary)
                    Spacer()
                }
            }
            .padding(.horizontal, 4).padding(.vertical, 6)
        }
    }

    private func toggleLike(_ id: String) {
        if likedMoments.contains(id) { likedMoments.remove(id) } else { likedMoments.insert(id) }
    }
}

enum MomentFilter: String, CaseIterable {
    case all, beach, safari, cultural, hiking
    var label: String { rawValue.capitalized }
}

struct TravelerMoment: Identifiable {
    let id: String
    var author: String
    var location: String
    var image: String
    var caption: String
    var likes: Int
    var verified: Bool
    var category: String
}
