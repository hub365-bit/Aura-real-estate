import SwiftUI

// MARK: - Experiences

struct ExperiencesListView: View {
    @State private var selectedCategory: String? = nil

    private let categories = ["All", "Safari", "City Tour", "Hiking", "Cultural", "Food & Nightlife", "Multi-Day"]
    private let experiences: [Experience] = [
        Experience(id: "ex1", title: "Maasai Mara 3-Day Safari", category: "Safari", price: 45000, currency: "KSh", duration: "3 days", rating: 4.9, reviews: 312, image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800", location: "Maasai Mara", escrowEnabled: true, cancellationPolicy: "Free cancellation 48h before"),
        Experience(id: "ex2", title: "Nairobi City Walking Tour", category: "City Tour", price: 2000, currency: "KSh", duration: "4 hours", rating: 4.6, reviews: 178, image: "https://images.unsplash.com/photo-1572271251226-d4a1c650fd6a?w=800", location: "Nairobi CBD", escrowEnabled: true, cancellationPolicy: "Free cancellation 24h before"),
        Experience(id: "ex3", title: "Mount Kenya Hiking Expedition", category: "Hiking", price: 35000, currency: "KSh", duration: "4 days", rating: 4.8, reviews: 145, image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800", location: "Mount Kenya", escrowEnabled: true, cancellationPolicy: "50% refund up to 72h"),
        Experience(id: "ex4", title: "Lamu Cultural & Food Tour", category: "Cultural", price: 8000, currency: "KSh", duration: "2 days", rating: 4.7, reviews: 89, image: "https://images.unsplash.com/photo-1590080669911-7a48d4b47669?w=800", location: "Lamu Island", escrowEnabled: true, cancellationPolicy: "Free cancellation 48h before"),
        Experience(id: "ex5", title: "Nairobi Nightlife Safari", category: "Food & Nightlife", price: 3500, currency: "KSh", duration: "6 hours", rating: 4.5, reviews: 234, image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800", location: "Westlands, Nairobi", escrowEnabled: true, cancellationPolicy: "Free cancellation 24h before"),
        Experience(id: "ex6", title: "Amboseli & Tsavo 5-Day Package", category: "Multi-Day", price: 85000, currency: "KSh", duration: "5 days", rating: 4.9, reviews: 167, image: "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?w=800", location: "Amboseli & Tsavo", escrowEnabled: true, cancellationPolicy: "75% refund up to 7 days"),
    ]

    private var filtered: [Experience] {
        guard let cat = selectedCategory, cat != "All" else { return experiences }
        return experiences.filter { $0.category == cat }
    }

    var body: some View {
        ScrollView {
            VStack(spacing: 14) {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 10) {
                        ForEach(categories, id: \.self) { cat in
                            FilterChip(title: cat, isSelected: (selectedCategory ?? "All") == cat) { selectedCategory = cat }
                        }
                    }
                    .padding(.horizontal)
                }
                LazyVStack(spacing: 12) {
                    ForEach(filtered) { exp in experienceCard(exp) }
                }
                .padding(.horizontal)
            }
            .padding(.vertical)
        }
        .background(Theme.background)
        .navigationTitle("Experiences")
    }

    private func experienceCard(_ exp: Experience) -> some View {
        VStack(alignment: .leading, spacing: 0) {
            ZStack(alignment: .topTrailing) {
                RemoteImage(url: exp.image, height: 170)
                    .clipShape(.rect(topLeadingRadius: 14, topTrailingRadius: 14))
                HStack(spacing: 6) {
                    Text(exp.category).font(.caption2.weight(.bold)).foregroundStyle(.white)
                        .padding(.horizontal, 8).padding(.vertical, 3)
                        .background(.black.opacity(0.5)).clipShape(Capsule())
                    if exp.escrowEnabled {
                        Image(systemName: "shield.checkerboard").font(.caption2).foregroundStyle(Theme.success)
                    }
                }
                .padding(8)
            }
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    VStack(alignment: .leading, spacing: 3) {
                        Text(exp.title).font(.headline)
                        HStack(spacing: 6) {
                            Label(exp.location, systemImage: "mappin").font(.caption).foregroundStyle(Theme.textSecondary)
                            Text("·").foregroundStyle(Theme.textSecondary)
                            Label(exp.duration, systemImage: "clock").font(.caption).foregroundStyle(Theme.textSecondary)
                        }
                    }
                    Spacer()
                    VStack(alignment: .trailing, spacing: 2) {
                        Text("KSh \(exp.price.formatted())").font(.subheadline.weight(.bold)).foregroundStyle(Theme.primary)
                        HStack(spacing: 2) {
                            Image(systemName: "star.fill").font(.caption2).foregroundStyle(Theme.secondary)
                            Text("\(exp.rating, specifier: "%.1f")").font(.caption).foregroundStyle(Theme.textSecondary)
                        }
                    }
                }
                HStack {
                    Text(exp.cancellationPolicy).font(.caption2).foregroundStyle(Theme.success)
                    Spacer()
                    Button("Book Now") {}.font(.subheadline.weight(.bold)).foregroundStyle(.white)
                        .padding(.horizontal, 16).padding(.vertical, 8)
                        .background(Theme.primary).clipShape(Capsule())
                }
            }
            .padding(12)
        }
        .background(Theme.surface).clipShape(.rect(cornerRadius: 14))
        .shadow(color: Theme.cardShadow, radius: 6, y: 3)
    }
}

struct Experience: Identifiable {
    let id: String
    var title: String
    var category: String
    var price: Int
    var currency: String
    var duration: String
    var rating: Double
    var reviews: Int
    var image: String
    var location: String
    var escrowEnabled: Bool
    var cancellationPolicy: String
}
