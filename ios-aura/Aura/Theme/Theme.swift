import SwiftUI

/// Aura design system — colors, gradients, and spacing matching the Expo app.
enum Theme {
    // Brand
    static let primary = Color(hex: "0891B2")      // deep teal
    static let secondary = Color(hex: "F59E0B")    // amber
    static let accent = Color(hex: "EC4899")       // rose pink
    static let success = Color(hex: "10B981")
    static let error = Color(hex: "EF4444")
    static let warning = Color(hex: "F59E0B")
    static let info = Color(hex: "3B82F6")

    // Adaptive surfaces use system colors so dark mode works automatically.
    static let background = Color(.systemGroupedBackground)
    static let surface = Color(.secondarySystemGroupedBackground)
    static let textPrimary = Color(.label)
    static let textSecondary = Color(.secondaryLabel)
    static let separator = Color(.separator)

    // Gradients
    static let brandGradient = LinearGradient(
        colors: [Color(hex: "0891B2"), Color(hex: "06B6D4")],
        startPoint: .topLeading, endPoint: .bottomTrailing
    )
    static let sunsetGradient = LinearGradient(
        colors: [Color(hex: "F59E0B"), Color(hex: "EC4899")],
        startPoint: .topLeading, endPoint: .bottomTrailing
    )

    static let cardRadius: CGFloat = 16
    static let cardShadow = Color.black.opacity(0.08)
}

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let r, g, b: UInt64
        switch hex.count {
        case 6:
            (r, g, b) = (int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (r, g, b) = (8, 145, 178)
        }
        self.init(.sRGB,
                  red: Double(r) / 255,
                  green: Double(g) / 255,
                  blue: Double(b) / 255,
                  opacity: 1)
    }
}

extension View {
    /// Standard Aura card styling: surface background, rounded corners, soft shadow.
    func auraCard(padding: CGFloat = 16) -> some View {
        self
            .padding(padding)
            .background(Theme.surface)
            .clipShape(.rect(cornerRadius: Theme.cardRadius))
            .shadow(color: Theme.cardShadow, radius: 8, x: 0, y: 4)
    }
}
