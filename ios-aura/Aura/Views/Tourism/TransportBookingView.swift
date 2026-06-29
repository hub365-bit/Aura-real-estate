import SwiftUI

// MARK: - Transport Booking

struct TransportBookingView: View {
    @State private var selectedType: TransportType = .all

    var body: some View {
        ScrollView {
            VStack(spacing: 14) {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 10) {
                        ForEach(TransportType.allCases, id: \.self) { t in
                            FilterChip(title: t.label, isSelected: selectedType == t, icon: t.icon) { selectedType = t }
                        }
                    }
                    .padding(.horizontal)
                }

                LazyVStack(spacing: 12) {
                    ForEach(transportOptions) { opt in transportCard(opt) }
                }
                .padding(.horizontal)
            }
            .padding(.vertical)
        }
        .background(Theme.background)
        .navigationTitle("Transport")
        .navigationBarTitleDisplayMode(.inline)
    }

    private func transportCard(_ opt: TransportOption) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Image(systemName: opt.icon).font(.title2).foregroundStyle(.white)
                    .frame(width: 44, height: 44).background(Theme.primary.gradient).clipShape(.rect(cornerRadius: 12))
                VStack(alignment: .leading, spacing: 2) {
                    Text(opt.title).font(.subheadline.weight(.semibold))
                    Text(opt.type).font(.caption).foregroundStyle(Theme.textSecondary)
                }
                Spacer()
                VStack(alignment: .trailing, spacing: 2) {
                    Text("KSh \(opt.price.formatted())").font(.subheadline.weight(.bold)).foregroundStyle(Theme.primary)
                    Text(opt.priceNote).font(.caption2).foregroundStyle(Theme.textSecondary)
                }
            }
            HStack(spacing: 16) {
                Label(opt.capacity, systemImage: "person.2.fill").font(.caption2).foregroundStyle(Theme.textSecondary)
                Label("Rating \(opt.driverRating, specifier: "%.1f")", systemImage: "star.fill").font(.caption2).foregroundStyle(Theme.secondary)
                if opt.verified { Label("Verified", systemImage: "checkmark.seal.fill").font(.caption2).foregroundStyle(Theme.success) }
            }
            Button("Book Now") {}.font(.subheadline.weight(.bold)).foregroundStyle(.white)
                .frame(maxWidth: .infinity).padding(.vertical, 10)
                .background(Theme.primary).clipShape(.rect(cornerRadius: 10))
        }
        .auraCard()
    }
}

enum TransportType: String, CaseIterable {
    case all, airport, carHire, tourVan, local
    var label: String {
        switch self {
        case .all: return "All"
        case .airport: return "Airport"
        case .carHire: return "Car Hire"
        case .tourVan: return "Tour Van"
        case .local: return "Local"
        }
    }
    var icon: String {
        switch self {
        case .all: return "square.grid.2x2"
        case .airport: return "airplane.departure"
        case .carHire: return "car.fill"
        case .tourVan: return "bus.fill"
        case .local: return "bicycle"
        }
    }
}

struct TransportOption: Identifiable {
    let id: String
    var title: String
    var type: String
    var price: Int
    var priceNote: String
    var capacity: String
    var driverRating: Double
    var verified: Bool
    var icon: String
}

private let transportOptions: [TransportOption] = [
    TransportOption(id: "t1", title: "JKIA Airport Pickup", type: "Airport Transfer", price: 2500, priceNote: "one-way", capacity: "4 passengers", driverRating: 4.8, verified: true, icon: "airplane.arrival"),
    TransportOption(id: "t2", title: "Private Car with Driver", type: "Car Hire", price: 5000, priceNote: "/day", capacity: "4 passengers", driverRating: 4.9, verified: true, icon: "car.fill"),
    TransportOption(id: "t3", title: "Safari Tour Van (8-Seater)", type: "Tour Van", price: 8000, priceNote: "/day", capacity: "8 passengers", driverRating: 4.7, verified: true, icon: "bus.doubledecker.fill"),
    TransportOption(id: "t4", title: "Boda Boda (Motorbike)", type: "Local Transport", price: 200, priceNote: "/km", capacity: "1 passenger", driverRating: 4.3, verified: false, icon: "bicycle"),
    TransportOption(id: "t5", title: "Tuk-Tuk Ride", type: "Local Transport", price: 350, priceNote: "/km", capacity: "3 passengers", driverRating: 4.4, verified: false, icon: "car.side.fill"),
]
