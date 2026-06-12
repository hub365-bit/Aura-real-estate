//
//  AuraApp.swift
//  Aura
//

import SwiftUI

@main
struct AuraApp: App {
    @State private var appState = AppState()

    var body: some Scene {
        WindowGroup {
            RootTabView()
                .environment(appState)
                .tint(Theme.primary)
        }
    }
}
