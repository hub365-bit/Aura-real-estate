import SwiftUI

// MARK: - Itinerary Builder

struct ItineraryBuilderView: View {
    @State private var startDate = Date()
    @State private var endDate = Date().addingTimeInterval(86400 * 3)
    @State private var activities: [ItineraryItem] = [
        ItineraryItem(title: "Arrival & Hotel Check-in", type: "hotel", time: "14:00", location: "Nairobi", duration: "1h"),
        ItineraryItem(title: "City Walking Tour", type: "tour", time: "16:00", location: "Nairobi CBD", duration: "3h"),
        ItineraryItem(title: "Dinner at Carnivore", type: "food", time: "19:30", location: "Langata", duration: "2h"),
    ]
    @State private var showAdd = false

    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                VStack(spacing: 10) {
                    DatePicker("Start", selection: $startDate, displayedComponents: .date)
                        .font(.subheadline)
                    DatePicker("End", selection: $endDate, displayedComponents: .date)
                        .font(.subheadline)
                }
                .padding()
                .background(Theme.surface).clipShape(.rect(cornerRadius: Theme.cardRadius))

                VStack(alignment: .leading, spacing: 12) {
                    HStack {
                        Text("Your Itinerary").font(.headline)
                        Spacer()
                        Button { showAdd = true } label: {
                            Label("Add", systemImage: "plus").font(.subheadline.weight(.semibold))
                        }
                    }

                    if activities.isEmpty {
                        EmptyStateView(icon: "calendar.badge.plus", title: "No activities yet", message: "Add hotels, tours, transport, and restaurants to build your trip plan.")
                    } else {
                        VStack(spacing: 0) {
                            ForEach(Array(activities.sorted(by: { $0.time < $1.time }).enumerated()), id: \.element.id) { i, item in
                                itineraryRow(item, isLast: i == activities.count - 1)
                            }
                        }
                        .background(Theme.surface).clipShape(.rect(cornerRadius: Theme.cardRadius))
                        .shadow(color: Theme.cardShadow, radius: 6, y: 3)
                    }
                }
                .padding(.horizontal)

                HStack(spacing: 12) {
                    Button { } label: {
                        Label("Download PDF", systemImage: "doc.fill")
                            .font(.subheadline.weight(.semibold)).foregroundStyle(.white)
                            .frame(maxWidth: .infinity).padding(12)
                            .background(Theme.primary).clipShape(.rect(cornerRadius: 12))
                    }
                    Button { } label: {
                        Label("Share", systemImage: "square.and.arrow.up")
                            .font(.subheadline.weight(.semibold)).foregroundStyle(Theme.primary)
                            .frame(maxWidth: .infinity).padding(12)
                            .overlay(RoundedRectangle(cornerRadius: 12).stroke(Theme.primary, lineWidth: 1))
                    }
                }
                .padding(.horizontal)
            }
            .padding(.vertical)
        }
        .background(Theme.background)
        .navigationTitle("Itinerary")
        .navigationBarTitleDisplayMode(.inline)
    }

    private func itemIcon(_ type: String) -> String {
        switch type {
        case "hotel": return "bed.double.fill"
        case "tour": return "binoculars.fill"
        case "food": return "fork.knife"
        case "transport": return "car.fill"
        default: return "mappin.circle.fill"
        }
    }

    private func itemColor(_ type: String) -> Color {
        switch type {
        case "hotel": return .blue
        case "tour": return .green
        case "food": return .orange
        case "transport": return .purple
        default: return Theme.primary
        }
    }

    private func itineraryRow(_ item: ItineraryItem, isLast: Bool) -> some View {
        HStack(alignment: .top, spacing: 0) {
            VStack(spacing: 0) {
                Circle().fill(itemColor(item.type)).frame(width: 12, height: 12)
                if !isLast { Rectangle().fill(Theme.separator).frame(width: 2).frame(maxHeight: .infinity) }
            }
            .frame(width: 24)
            VStack(alignment: .leading, spacing: 4) {
                Text(item.time).font(.caption.weight(.bold)).foregroundStyle(itemColor(item.type))
                Text(item.title).font(.subheadline.weight(.semibold))
                HStack(spacing: 8) {
                    Label(item.location, systemImage: "mappin").font(.caption2).foregroundStyle(Theme.textSecondary)
                    Label(item.duration, systemImage: "clock").font(.caption2).foregroundStyle(Theme.textSecondary)
                }
            }
            .padding(.bottom, isLast ? 0 : 16)
        }
        .padding(.horizontal, 14).padding(.top, 14)
        .swipeActions { Button("Remove") { activities.removeAll { $0.id == item.id } } }
    }
}

struct ItineraryItem: Identifiable {
    let id = UUID()
    var title: String
    var type: String
    var time: String
    var location: String
    var duration: String
}
