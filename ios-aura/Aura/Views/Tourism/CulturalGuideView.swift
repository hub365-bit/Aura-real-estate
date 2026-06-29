import SwiftUI

// MARK: - Cultural Guide

struct CulturalGuideView: View {
    @State private var selectedSection: String = "customs"

    private let sections = ["customs", "dress", "safety", "emergency", "sim", "tipping"]
    private let sectionLabels = ["Customs", "Dress Code", "Safety Tips", "Emergency", "SIM & Internet", "Tipping"]

    var body: some View {
        ScrollView {
            VStack(spacing: 14) {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 10) {
                        ForEach(Array(zip(sections, sectionLabels)), id: \.0) { id, label in
                            FilterChip(title: label, isSelected: selectedSection == id) { selectedSection = id }
                        }
                    }
                    .padding(.horizontal)
                }

                VStack(alignment: .leading, spacing: 12) {
                    sectionContent
                }
                .auraCard()
                .padding(.horizontal)
            }
            .padding(.vertical)
        }
        .background(Theme.background)
        .navigationTitle("Know Before You Go")
        .navigationBarTitleDisplayMode(.inline)
    }

    @ViewBuilder
    private var sectionContent: some View {
        switch selectedSection {
        case "customs":
            infoHeader("Local Customs", "hand.wave.fill")
            tip("Greet with 'Jambo' or 'Habari' — handshakes are common")
            tip("Respect elders — use 'Mzee' for older men, 'Mama' for older women")
            tip("Photography of government buildings, airports, and military sites is prohibited")
            tip("Tipping is appreciated but not mandatory — 10% in restaurants is standard")
        case "dress":
            infoHeader("Dress Code", "tshirt.fill")
            tip("Kenya is generally conservative — modest dress is appreciated")
            tip("Coastal areas (Mombasa, Diani) are more relaxed — beachwear is fine at resorts")
            tip("For safaris, neutral colors (khaki, green, brown) are recommended")
            tip("In mosques and temples, women should cover shoulders and knees")
        case "safety":
            infoHeader("Safety Tips", "shield.checkerboard")
            tip("Keep valuables in hotel safes — avoid flashing expensive items in public")
            tip("Use registered taxis or ride-hailing apps (Uber, Bolt) at night")
            tip("Avoid walking alone in unfamiliar areas after dark")
            tip("Drink bottled or filtered water — avoid tap water")
            tip("Keep digital copies of your passport and visa")
        case "emergency":
            infoHeader("Emergency Contacts", "phone.fill")
            emergencyRow("Police", "999 / 112")
            emergencyRow("Ambulance", "999")
            emergencyRow("Fire", "999")
            emergencyRow("Tourist Police", "+254 20 2724154")
            emergencyRow("Aura Support", "+254 700 000 000")
        case "sim":
            infoHeader("SIM Card & Internet", "antenna.radiowaves.left.and.right")
            tip("Buy a Safaricom SIM at JKIA or any Safaricom shop — requires passport")
            tip("M-Pesa is widely used for mobile payments — set it up with your Safaricom line")
            tip("4G/LTE is widely available in cities; rural areas may have limited coverage")
            tip("Most hotels and cafes offer free WiFi")
        case "tipping":
            infoHeader("Tipping Culture", "banknote.fill")
            tip("Restaurants: 10% of bill is customary if service charge is not included")
            tip("Safari guides: KSh 500-1,000 per person per day")
            tip("Hotel porters: KSh 100-200 per bag")
            tip("Taxi drivers: Round up to nearest KSh 100")
        default: EmptyView()
        }
    }

    private func infoHeader(_ title: String, _ icon: String) -> some View {
        HStack(spacing: 10) {
            Image(systemName: icon).font(.title2).foregroundStyle(Theme.primary)
            Text(title).font(.headline)
        }
        .padding(.bottom, 4)
    }

    private func tip(_ text: String) -> some View {
        HStack(alignment: .top, spacing: 10) {
            Image(systemName: "circle.fill").font(.system(size: 6)).foregroundStyle(Theme.primary)
                .padding(.top, 7)
            Text(text).font(.subheadline).foregroundStyle(Theme.textSecondary)
        }
    }

    private func emergencyRow(_ service: String, _ number: String) -> some View {
        HStack {
            Text(service).font(.subheadline.weight(.medium))
            Spacer()
            Text(number).font(.subheadline.weight(.bold)).foregroundStyle(Theme.primary)
                .padding(.horizontal, 10).padding(.vertical, 4)
                .background(Theme.primary.opacity(0.1)).clipShape(.rect(cornerRadius: 8))
        }
    }
}
