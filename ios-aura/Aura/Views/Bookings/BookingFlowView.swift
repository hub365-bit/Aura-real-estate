import SwiftUI

struct BookingFlowView: View {
    let property: Property
    @Environment(\.dismiss) private var dismiss
    @State private var date = Date()
    @State private var step = 0
    @State private var confirmed = false

    var body: some View {
        NavigationStack {
            Group {
                if confirmed {
                    BookingConfirmedView(ref: "BK-\(Int.random(in: 10000...99999))") { dismiss() }
                } else {
                    Form {
                        Section("Property") {
                            HStack {
                                RemoteImage(url: property.images.first, height: 60)
                                    .frame(width: 80)
                                    .clipShape(.rect(cornerRadius: 8))
                                VStack(alignment: .leading) {
                                    Text(property.title).font(.subheadline.weight(.semibold)).lineLimit(2)
                                    Text(property.formattedPrice).font(.caption).foregroundStyle(Theme.primary)
                                }
                            }
                        }
                        Section("Viewing Date") {
                            DatePicker("Preferred date", selection: $date, displayedComponents: [.date, .hourAndMinute])
                        }
                        Section("Payment Protection") {
                            HStack {
                                Image(systemName: "lock.shield.fill").foregroundStyle(Theme.success)
                                Text("Your deposit is held securely in Aura escrow and released only after the viewing.")
                                    .font(.caption).foregroundStyle(Theme.textSecondary)
                            }
                        }
                    }
                }
            }
            .navigationTitle("Book Viewing")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                if !confirmed {
                    ToolbarItem(placement: .cancellationAction) { Button("Cancel") { dismiss() } }
                    ToolbarItem(placement: .confirmationAction) {
                        Button("Confirm") { withAnimation { confirmed = true } }
                    }
                }
            }
        }
    }
}

struct BookingConfirmedView: View {
    let ref: String
    let onDone: () -> Void
    @State private var animate = false

    var body: some View {
        VStack(spacing: 20) {
            Spacer()
            Image(systemName: "checkmark.circle.fill")
                .font(.system(size: 88))
                .foregroundStyle(Theme.success)
                .scaleEffect(animate ? 1 : 0.5)
                .animation(.spring(response: 0.5, dampingFraction: 0.6), value: animate)
            Text("Booking Confirmed!")
                .font(.title2.weight(.bold))
            Text("Reference: \(ref)")
                .font(.subheadline)
                .foregroundStyle(Theme.textSecondary)
            Text("You'll receive a confirmation message shortly.")
                .font(.subheadline)
                .foregroundStyle(Theme.textSecondary)
                .multilineTextAlignment(.center)
            Spacer()
            Button(action: onDone) {
                Text("Done")
                    .font(.headline)
                    .foregroundStyle(.white)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Theme.primary)
                    .clipShape(.rect(cornerRadius: 14))
            }
            .padding(.horizontal)
        }
        .padding()
        .onAppear { animate = true }
    }
}
