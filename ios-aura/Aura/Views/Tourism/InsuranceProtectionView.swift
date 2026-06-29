import SwiftUI

// MARK: - Insurance & Protection

struct InsuranceProtectionView: View {
    @State private var selectedPlan: String? = nil

    private let plans: [ProtectionPlan] = [
        ProtectionPlan(id: "basic", name: "Basic Travel Insurance", price: 1500, period: "/trip", features: ["Medical emergency cover (KSh 500k)", "Trip cancellation (KSh 50k)", "Lost baggage (KSh 20k)", "24/7 emergency hotline"], icon: "shield.fill", color: Theme.info),
        ProtectionPlan(id: "premium", name: "Premium Protection", price: 3500, period: "/trip", features: ["Medical cover (KSh 2M)", "Trip cancellation (KSh 200k)", "Lost baggage (KSh 100k)", "Adventure sports cover", "Emergency evacuation", "COVID-19 cover", "24/7 concierge hotline"], icon: "shield.checkerboard", color: Theme.primary),
        ProtectionPlan(id: "safari", name: "Safari Cancellation Guard", price: 800, period: "/booking", features: ["Full refund on cancellation 24h before", "Partial refund up to 4h before", "Weather-related rescheduling", "Emergency safari evacuation"], icon: "leaf.fill", color: Theme.success),
    ]

    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                VStack(spacing: 6) {
                    Image(systemName: "shield.checkerboard").font(.system(size: 48)).foregroundStyle(Theme.success)
                    Text("Travel Protection").font(.title2.weight(.bold))
                    Text("Optional add-ons for peace of mind. Available at checkout for any booking.")
                        .font(.subheadline).foregroundStyle(Theme.textSecondary).multilineTextAlignment(.center)
                }
                .padding()

                ForEach(plans) { plan in planCard(plan) }

                VStack(spacing: 8) {
                    Label("24/7 Emergency Hotline", systemImage: "phone.fill").font(.subheadline.weight(.semibold)).foregroundStyle(Theme.error)
                    Text("+254 700 000 999").font(.title3.weight(.bold)).foregroundStyle(Theme.primary)
                }
                .padding()
                .background(Theme.surface).clipShape(.rect(cornerRadius: Theme.cardRadius))

                HStack(spacing: 12) {
                    Button { } label: {
                        Label("Call Support", systemImage: "phone.fill")
                            .font(.subheadline.weight(.semibold)).foregroundStyle(.white)
                            .frame(maxWidth: .infinity).padding(12)
                            .background(Theme.primary).clipShape(.rect(cornerRadius: 12))
                    }
                    Button { } label: {
                        Label("Add at Checkout", systemImage: "cart.fill.badge.plus")
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
        .navigationTitle("Protection")
        .navigationBarTitleDisplayMode(.inline)
    }

    private func planCard(_ plan: ProtectionPlan) -> some View {
        Button { selectedPlan = plan.id } label: {
            VStack(alignment: .leading, spacing: 10) {
                HStack {
                    Image(systemName: plan.icon).font(.title2).foregroundStyle(plan.color)
                    Text(plan.name).font(.headline)
                    Spacer()
                    Text("KSh \(plan.price.formatted())\(plan.period)")
                        .font(.subheadline.weight(.bold)).foregroundStyle(Theme.primary)
                    Image(systemName: selectedPlan == plan.id ? "checkmark.circle.fill" : "circle")
                        .foregroundStyle(selectedPlan == plan.id ? Theme.primary : Theme.textSecondary)
                }
                ForEach(plan.features, id: \.self) { feature in
                    Label(feature, systemImage: "checkmark").font(.caption).foregroundStyle(Theme.textSecondary)
                }
            }
            .padding()
            .background(Theme.surface)
            .clipShape(.rect(cornerRadius: Theme.cardRadius))
            .overlay(RoundedRectangle(cornerRadius: Theme.cardRadius).stroke(selectedPlan == plan.id ? Theme.primary : .clear, lineWidth: 2))
        }
        .buttonStyle(.plain)
        .padding(.horizontal)
    }
}

struct ProtectionPlan: Identifiable {
    let id: String
    var name: String
    var price: Int
    var period: String
    var features: [String]
    var icon: String
    var color: Color
}
