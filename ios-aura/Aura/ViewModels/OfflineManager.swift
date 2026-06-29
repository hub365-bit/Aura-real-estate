import SwiftUI

// MARK: - Offline Support Manager

@Observable
final class OfflineManager {
    var isOffline = false
    var lastSynced: Date? = nil
    var queuedActions: [OfflineAction] = []
    var savedPropertyIds: Set<String> = []
    var cachedListings: [Property] = []

    private let defaults = UserDefaults.standard

    init() {
        savedPropertyIds = Set(defaults.stringArray(forKey: "offline_savedProperties") ?? [])
    }

    func setOffline(_ offline: Bool) {
        isOffline = offline
        if !offline { syncQueuedActions() }
    }

    func saveListingForOffline(_ id: String) {
        savedPropertyIds.insert(id)
        defaults.set(Array(savedPropertyIds), forKey: "offline_savedProperties")
    }

    func queueAction(_ action: OfflineAction) {
        queuedActions.append(action)
    }

    func syncQueuedActions() {
        guard !queuedActions.isEmpty else { return }
        for action in queuedActions { processAction(action) }
        queuedActions.removeAll()
        lastSynced = Date()
    }

    private func processAction(_ action: OfflineAction) {
        switch action.type {
        case .saveBooking:
            defaults.set(action.payload, forKey: "offline_booking_\(action.id)")
        case .saveFavorite:
            savedPropertyIds.insert(action.id)
            defaults.set(Array(savedPropertyIds), forKey: "offline_savedProperties")
        }
    }

    func cachedProperty(_ id: String) -> Property? {
        cachedListings.first { $0.id == id }
    }

    func cacheListing(_ property: Property) {
        if !cachedListings.contains(where: { $0.id == property.id }) {
            cachedListings.append(property)
        }
    }
}

struct OfflineAction: Identifiable {
    let id: String
    var type: OfflineActionType
    var payload: String
    var createdAt: Date = Date()
}

enum OfflineActionType: String {
    case saveBooking, saveFavorite
}

// MARK: - Offline-aware Tab View Overlay

struct OfflineBannerView: View {
    let manager: OfflineManager

    var body: some View {
        if manager.isOffline {
            VStack(spacing: 0) {
                HStack(spacing: 6) {
                    Image(systemName: "wifi.slash").font(.caption)
                    Text("You're offline — saved items are still available")
                        .font(.caption)
                    Spacer()
                    if let count = manager.queuedActions.count as Int?, count > 0 {
                        Text("\(count) pending")
                            .font(.caption2.weight(.bold)).foregroundStyle(.white)
                            .padding(.horizontal, 8).padding(.vertical, 3)
                            .background(Theme.warning).clipShape(Capsule())
                    }
                }
                .foregroundStyle(.white)
                .padding(.horizontal, 16).padding(.vertical, 10)
                .background(Theme.warning)
            }
        }
    }
}
