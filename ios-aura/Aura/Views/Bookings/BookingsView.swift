import SwiftUI

struct BookingsView: View {
    @State private var filter: BookingStatus? = nil

    private var bookings: [Booking] {
        MockData.bookings.filter { filter == nil || $0.status == filter }
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 14) {
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 10) {
                            FilterChip(title: "All", isSelected: filter == nil) { filter = nil }
                            FilterChip(title: "Confirmed", isSelected: filter == .confirmed) { filter = .confirmed }
                            FilterChip(title: "Pending", isSelected: filter == .pending) { filter = .pending }
                            FilterChip(title: "Completed", isSelected: filter == .completed) { filter = .completed }
                        }
                        .padding(.horizontal)
                    }

                    if bookings.isEmpty {
                        EmptyStateView(icon: "calendar.badge.exclamationmark", title: "No bookings", message: "Your bookings will appear here.")
                    } else {
                        ForEach(bookings) { booking in
                            NavigationLink(value: booking) {
                                BookingCard(booking: booking)
                            }
                            .buttonStyle(.plain)
                            .padding(.horizontal)
                        }
                    }
                }
                .padding(.vertical)
            }
            .background(Theme.background)
            .navigationTitle("Bookings")
            .navigationDestination(for: Booking.self) { BookingDetailView(booking: $0) }
        }
    }
}

struct BookingCard: View {
    let booking: Booking

    private var title: String {
        if let p = MockData.property(id: booking.propertyId) { return p.title }
        if let s = MockData.provider(id: booking.serviceProviderId) { return s.businessName }
        return booking.type.capitalized
    }

    private var statusColor: Color {
        switch booking.status {
        case .confirmed: return Theme.success
        case .pending: return Theme.warning
        case .cancelled: return Theme.error
        case .completed: return Theme.info
        }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Image(systemName: booking.type == "property" ? "house.fill" : "wrench.and.screwdriver.fill")
                    .foregroundStyle(.white)
                    .frame(width: 40, height: 40)
                    .background(Theme.primary.gradient)
                    .clipShape(.rect(cornerRadius: 10))
                VStack(alignment: .leading, spacing: 2) {
                    Text(title).font(.subheadline.weight(.semibold)).lineLimit(1)
                    Text(booking.bookingRef).font(.caption).foregroundStyle(Theme.textSecondary)
                }
                Spacer()
                Text(booking.status.rawValue.capitalized)
                    .font(.caption.weight(.bold))
                    .foregroundStyle(statusColor)
                    .padding(.horizontal, 10).padding(.vertical, 5)
                    .background(statusColor.opacity(0.12))
                    .clipShape(Capsule())
            }
            Divider()
            HStack {
                Label(booking.timeSlot ?? formattedDate(booking.date), systemImage: "clock")
                    .font(.caption).foregroundStyle(Theme.textSecondary)
                Spacer()
                Text("\(booking.currency) \(booking.totalAmount.formatted())")
                    .font(.subheadline.weight(.bold))
                    .foregroundStyle(Theme.primary)
            }
        }
        .auraCard()
    }
}

func formattedDate(_ iso: String) -> String {
    let formatter = ISO8601DateFormatter()
    formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
    let date = ISO8601DateFormatter().date(from: iso) ?? formatter.date(from: iso)
    guard let date else { return iso }
    let df = DateFormatter()
    df.dateFormat = "MMM d, h:mm a"
    return df.string(from: date)
}

struct BookingDetailView: View {
    let booking: Booking

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                BookingCard(booking: booking)

                VStack(alignment: .leading, spacing: 12) {
                    Text("Escrow Status").font(.headline)
                    HStack {
                        Image(systemName: "lock.shield.fill").foregroundStyle(Theme.success)
                        VStack(alignment: .leading) {
                            Text("Funds held in escrow").font(.subheadline.weight(.medium))
                            Text("Released after completion").font(.caption).foregroundStyle(Theme.textSecondary)
                        }
                        Spacer()
                        Text("KSh \(booking.totalAmount.formatted())").font(.subheadline.weight(.bold))
                    }
                }
                .auraCard()

                VStack(alignment: .leading, spacing: 12) {
                    Text("Actions").font(.headline)
                    actionRow("message.fill", "Message", Theme.primary)
                    actionRow("doc.text.fill", "View Agreement", Theme.info)
                    actionRow("xmark.circle.fill", "Cancel Booking", Theme.error)
                }
                .auraCard()
            }
            .padding()
        }
        .background(Theme.background)
        .navigationTitle("Booking")
        .navigationBarTitleDisplayMode(.inline)
    }

    private func actionRow(_ icon: String, _ title: String, _ color: Color) -> some View {
        HStack {
            Image(systemName: icon).foregroundStyle(color).frame(width: 24)
            Text(title).font(.subheadline)
            Spacer()
            Image(systemName: "chevron.right").font(.caption).foregroundStyle(Theme.textSecondary)
        }
        .padding(.vertical, 4)
    }
}
