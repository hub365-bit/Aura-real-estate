import SwiftUI
import MapKit

struct MapMarkerItem: Identifiable {
    let id: String
    let title: String
    let coordinate: CLLocationCoordinate2D
    let isProperty: Bool
    let subtitle: String
    let imageURL: String?
}

struct MapExploreView: View {
    @State private var filter = 0  // 0 all, 1 properties, 2 services
    @State private var selected: MapMarkerItem?
    @State private var position: MapCameraPosition = .region(
        MKCoordinateRegion(center: CLLocationCoordinate2D(latitude: -1.2864, longitude: 36.8172),
                           span: MKCoordinateSpan(latitudeDelta: 0.2, longitudeDelta: 0.2))
    )

    private var markers: [MapMarkerItem] {
        var items: [MapMarkerItem] = []
        if filter != 2 {
            items += MockData.properties.map {
                MapMarkerItem(id: "prop-\($0.id)", title: $0.title,
                              coordinate: CLLocationCoordinate2D(latitude: $0.location.lat, longitude: $0.location.lng),
                              isProperty: true, subtitle: $0.formattedPrice, imageURL: $0.images.first)
            }
        }
        if filter != 1 {
            items += MockData.serviceProviders.map {
                MapMarkerItem(id: "srv-\($0.id)", title: $0.businessName,
                              coordinate: CLLocationCoordinate2D(latitude: $0.location.lat, longitude: $0.location.lng),
                              isProperty: false, subtitle: $0.category, imageURL: $0.images.first)
            }
        }
        return items
    }

    var body: some View {
        NavigationStack {
            ZStack(alignment: .top) {
                Map(position: $position) {
                    ForEach(markers) { marker in
                        Annotation(marker.title, coordinate: marker.coordinate) {
                            Button {
                                withAnimation { selected = marker }
                            } label: {
                                Image(systemName: marker.isProperty ? "house.fill" : "wrench.and.screwdriver.fill")
                                    .font(.caption)
                                    .foregroundStyle(.white)
                                    .padding(8)
                                    .background(marker.isProperty ? Theme.primary : Theme.accent)
                                    .clipShape(Circle())
                                    .shadow(radius: 3)
                            }
                        }
                    }
                }
                .ignoresSafeArea(edges: .bottom)

                // Filter chips
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 10) {
                        FilterChip(title: "All", isSelected: filter == 0) { filter = 0 }
                        FilterChip(title: "Properties", isSelected: filter == 1) { filter = 1 }
                        FilterChip(title: "Services", isSelected: filter == 2) { filter = 2 }
                    }
                    .padding(.horizontal)
                }
                .padding(.top, 8)

                if let selected {
                    VStack {
                        Spacer()
                        markerCard(selected)
                            .padding()
                    }
                }
            }
            .overlay(alignment: .bottomTrailing) {
                Button {
                    withAnimation {
                        position = .region(MKCoordinateRegion(center: CLLocationCoordinate2D(latitude: -1.2864, longitude: 36.8172), span: MKCoordinateSpan(latitudeDelta: 0.2, longitudeDelta: 0.2)))
                    }
                } label: {
                    Image(systemName: "location.fill")
                        .foregroundStyle(Theme.primary)
                        .padding(12)
                        .background(.regularMaterial, in: Circle())
                        .shadow(radius: 4)
                }
                .padding()
                .padding(.bottom, selected != nil ? 120 : 0)
            }
            .navigationTitle("Explore")
            .navigationBarTitleDisplayMode(.inline)
        }
    }

    private func markerCard(_ marker: MapMarkerItem) -> some View {
        HStack(spacing: 12) {
            RemoteImage(url: marker.imageURL, height: 64)
                .frame(width: 80)
                .clipShape(.rect(cornerRadius: 10))
            VStack(alignment: .leading, spacing: 4) {
                Text(marker.title).font(.subheadline.weight(.semibold)).lineLimit(2)
                Text(marker.subtitle).font(.caption).foregroundStyle(Theme.primary)
            }
            Spacer()
            Button {
                withAnimation { selected = nil }
            } label: {
                Image(systemName: "xmark.circle.fill")
                    .foregroundStyle(Theme.textSecondary)
            }
        }
        .padding(12)
        .background(.regularMaterial)
        .clipShape(.rect(cornerRadius: 16))
        .shadow(color: Theme.cardShadow, radius: 8, y: 4)
    }
}
