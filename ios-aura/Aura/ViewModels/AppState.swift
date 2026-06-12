import SwiftUI

/// Global app state: current user, favorites, follows, tourist mode. Persists to UserDefaults.
@Observable
final class AppState {
    var currentUser: User = MockData.currentUser
    var favoriteIds: Set<String> = []
    var followedProviderIds: Set<String> = []
    var compareIds: Set<String> = []
    var touristMode: Bool = false
    var preferredCurrency: String = "KES"
    var hasOnboarded: Bool = false

    private let defaults = UserDefaults.standard

    init() {
        favoriteIds = Set(defaults.stringArray(forKey: "favoriteIds") ?? [])
        followedProviderIds = Set(defaults.stringArray(forKey: "followedProviderIds") ?? [])
        touristMode = defaults.bool(forKey: "touristMode")
        hasOnboarded = defaults.bool(forKey: "hasOnboarded")
        if let cur = defaults.string(forKey: "preferredCurrency") { preferredCurrency = cur }
    }

    func toggleFavorite(_ id: String) {
        if favoriteIds.contains(id) { favoriteIds.remove(id) } else { favoriteIds.insert(id) }
        defaults.set(Array(favoriteIds), forKey: "favoriteIds")
    }

    func isFavorite(_ id: String) -> Bool { favoriteIds.contains(id) }

    func toggleFollow(_ id: String) {
        if followedProviderIds.contains(id) { followedProviderIds.remove(id) } else { followedProviderIds.insert(id) }
        defaults.set(Array(followedProviderIds), forKey: "followedProviderIds")
    }

    func isFollowing(_ id: String) -> Bool { followedProviderIds.contains(id) }

    func toggleCompare(_ id: String) {
        if compareIds.contains(id) { compareIds.remove(id) }
        else if compareIds.count < 3 { compareIds.insert(id) }
    }

    func setTouristMode(_ on: Bool) {
        touristMode = on
        defaults.set(on, forKey: "touristMode")
    }

    func completeOnboarding() {
        hasOnboarded = true
        defaults.set(true, forKey: "hasOnboarded")
    }

    func setCurrency(_ c: String) {
        preferredCurrency = c
        defaults.set(c, forKey: "preferredCurrency")
    }
}
