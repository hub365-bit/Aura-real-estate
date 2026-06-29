import SwiftUI

struct TourismHubView: View {
    let accentColors: [Color] = [.orange, .blue, .green, .purple, .red, .mint, .pink, .indigo, .teal, .brown, .cyan]
    let iconNames: [String] = [
        "bed.double.fill", "figure.hiking", "binoculars.fill",
        "map.fill", "car.fill", "book.fill",
        "brain.head.profile", "camera.fill", "shield.checkerboard",
        "star.fill", "building.columns.fill"
    ]
    let cardTitles: [String] = [
        "Hotels", "Tour Guides", "Experiences",
        "Itinerary", "Transport", "Cultural Guide",
        "AI Assistant", "Traveler Moments", "Protection",
        "Post-Trip", "Partners"
    ]
    let cardSubtitles: [String] = [
        "Find your perfect stay with advanced filters",
        "Verified guides, safari & city tours",
        "Safari, food tours, cultural visits",
        "Auto-generated day-by-day plans",
        "Airport pickup, car hire, local transport",
        "Customs, dress code, safety tips",
        "Travel recommendations & rescheduling",
        "Guest photos & verified traveler badges",
        "Insurance, cancellation, emergency support",
        "Reviews, rewards & travel journals",
        "National parks, museums, official operators"
    ]
    let navDestinations: [TourismRoute] = [
        .hotels, .guides, .experiences,
        .itinerary, .transport, .culturalGuide,
        .aiAssistant, .travelerMoments, .insurance,
        .postTrip, .partners
    ]

    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                VStack(spacing: 8) {
                    Image(systemName: "airplane.circle.fill")
                        .font(.system(size: 48))
                        .foregroundStyle(Theme.accent)
                    Text("Aura Tourism")
                        .font(.title2.weight(.bold))
                    Text("Explore Kenya & beyond — hotels, tours, and travel experiences curated for you.")
                        .font(.subheadline)
                        .foregroundStyle(Theme.textSecondary)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 24)
                }
                .padding(.vertical, 16)

                LazyVGrid(columns: [GridItem(.flexible(), spacing: 12), GridItem(.flexible(), spacing: 12)], spacing: 12) {
                    ForEach(Array(zip(cardTitles.indices, navDestinations)), id: \.0) { i, dest in
                        NavigationLink(value: dest) {
                            VStack(alignment: .leading, spacing: 8) {
                                Image(systemName: iconNames[i])
                                    .font(.title2)
                                    .foregroundStyle(.white)
                                    .frame(width: 40, height: 40)
                                    .background(accentColors[i % accentColors.count].gradient)
                                    .clipShape(.rect(cornerRadius: 12))
                                Text(cardTitles[i])
                                    .font(.subheadline.weight(.semibold))
                                    .foregroundStyle(Theme.textPrimary)
                                Text(cardSubtitles[i])
                                    .font(.caption2)
                                    .foregroundStyle(Theme.textSecondary)
                                    .lineLimit(2)
                                    .fixedSize(horizontal: false, vertical: true)
                                Spacer(minLength: 0)
                            }
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .padding(12)
                            .frame(height: 140)
                            .background(Theme.surface)
                            .clipShape(.rect(cornerRadius: Theme.cardRadius))
                            .shadow(color: Theme.cardShadow, radius: 4, y: 2)
                        }
                        .buttonStyle(.plain)
                    }
                }
                .padding(.horizontal)
            }
            .padding(.vertical)
        }
        .background(Theme.background)
        .navigationTitle("Tourism")
        .navigationBarTitleDisplayMode(.inline)
        .navigationDestination(for: TourismRoute.self) { route in
            switch route {
            case .hotels: HotelSearchView()
            case .guides: TourGuideMarketplaceView()
            case .experiences: ExperiencesListView()
            case .itinerary: ItineraryBuilderView()
            case .transport: TransportBookingView()
            case .culturalGuide: CulturalGuideView()
            case .aiAssistant: TravelAssistantView()
            case .travelerMoments: TravelerMomentsView()
            case .insurance: InsuranceProtectionView()
            case .postTrip: PostTripEngagementView()
            case .partners: TourismPartnersView()
            }
        }
    }
}

enum TourismRoute: Hashable {
    case hotels, guides, experiences, itinerary, transport
    case culturalGuide, aiAssistant, travelerMoments, insurance
    case postTrip, partners
}
