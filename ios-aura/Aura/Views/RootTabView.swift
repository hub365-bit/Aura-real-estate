import SwiftUI

struct RootTabView: View {
    @State private var selection: Int = 0

    var body: some View {
        TabView(selection: $selection) {
            DiscoverView()
                .tabItem { Label("Discover", systemImage: "house.fill") }
                .tag(0)
            ServicesView()
                .tabItem { Label("Services", systemImage: "wrench.and.screwdriver.fill") }
                .tag(1)
            BookingsView()
                .tabItem { Label("Bookings", systemImage: "calendar") }
                .tag(2)
            MapExploreView()
                .tabItem { Label("Map", systemImage: "map.fill") }
                .tag(3)
            FeedView()
                .tabItem { Label("Feed", systemImage: "square.stack.fill") }
                .tag(4)
            ProfileView()
                .tabItem { Label("Profile", systemImage: "person.fill") }
                .tag(5)
        }
    }
}
