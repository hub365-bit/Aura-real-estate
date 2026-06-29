import SwiftUI

// MARK: - Tourist Onboarding

struct TouristOnboardingView: View {
    @Environment(AppState.self) private var app
    @Environment(\.dismiss) private var dismiss
    @State private var step = 0
    @State private var nationality = ""
    @State private var preferredLanguage = "English"
    @State private var startDate = Date()
    @State private var endDate = Date().addingTimeInterval(86400 * 7)
    @State private var selectedInterests: Set<String> = []
    @State private var groupType: String = "Solo"
    @State private var preferredCurrency = "KES"
    @State private var showInterestPicker = false

    private let languages = ["English", "Swahili", "French", "Arabic", "German", "Chinese"]
    private let interests = ["Safari", "Beach", "Culture", "Food", "Nightlife", "Adventure", "Hiking", "Shopping"]
    private let groupTypes = ["Solo", "Couple", "Family", "Group"]
    private let currencies = ["KES", "USD", "EUR", "GBP", "TZS", "UGX"]

    var body: some View {
        VStack(spacing: 0) {
            // Progress bar
            ProgressView(value: Double(step + 1), total: 5).tint(Theme.primary).padding()

            TabView(selection: $step) {
                // Step 1: Welcome
                stepWelcome.tag(0)
                // Step 2: Travel Dates
                stepDates.tag(1)
                // Step 3: Interests
                stepInterests.tag(2)
                // Step 4: Profile
                stepProfile.tag(3)
                // Step 5: Currency
                stepCurrency.tag(4)
            }
            .tabViewStyle(.page(indexDisplayMode: .never))

            HStack(spacing: 12) {
                if step > 0 {
                    Button("Back") { withAnimation { step -= 1 } }
                        .font(.subheadline.weight(.medium)).foregroundStyle(Theme.textSecondary)
                }
                Spacer()
                Button(step == 4 ? "Start Exploring" : "Next") {
                    if step < 4 { withAnimation { step += 1 } } else { complete() }
                }
                .font(.headline).foregroundStyle(.white)
                .padding(.horizontal, 32).padding(.vertical, 14)
                .background(Theme.primary).clipShape(.rect(cornerRadius: 14))
            }
            .padding()
        }
        .background(Theme.background)
        .navigationTitle("Tourist Mode")
        .navigationBarTitleDisplayMode(.inline)
    }

    // MARK: Step Views

    private var stepWelcome: some View {
        VStack(spacing: 24) {
            Spacer()
            Image(systemName: "airplane.circle.fill").font(.system(size: 72)).foregroundStyle(Theme.accent)
            Text("Welcome to\nAura Tourism").font(.system(size: 32, weight: .bold)).multilineTextAlignment(.center)
            Text("Discover the best of Kenya and beyond — hotels, safaris, tours, and local experiences curated just for you.")
                .font(.subheadline).foregroundStyle(Theme.textSecondary).multilineTextAlignment(.center).padding(.horizontal, 24)
            VStack(spacing: 12) {
                HStack(spacing: 8) {
                    Image(systemName: "checkmark.circle.fill").foregroundStyle(Theme.success)
                    Text("Personalized recommendations").font(.subheadline)
                }
                HStack(spacing: 8) {
                    Image(systemName: "checkmark.circle.fill").foregroundStyle(Theme.success)
                    Text("Multi-currency support").font(.subheadline)
                }
                HStack(spacing: 8) {
                    Image(systemName: "checkmark.circle.fill").foregroundStyle(Theme.success)
                    Text("Offline itineraries").font(.subheadline)
                }
            }
            Spacer()
        }
    }

    private var stepDates: some View {
        ScrollView {
            VStack(spacing: 24) {
                Spacer().frame(height: 32)
                Image(systemName: "calendar.badge.clock").font(.system(size: 56)).foregroundStyle(Theme.primary)
                Text("When are you traveling?").font(.title2.weight(.bold))
                Text("We'll use these dates to personalize your recommendations and availability.")
                    .font(.subheadline).foregroundStyle(Theme.textSecondary).multilineTextAlignment(.center)
                    .padding(.horizontal, 24)

                DatePicker("Start Date", selection: $startDate, displayedComponents: .date)
                    .datePickerStyle(.graphical).tint(Theme.primary).padding(.horizontal)

                DatePicker("End Date", selection: $endDate, in: startDate..., displayedComponents: .date)
                    .datePickerStyle(.compact).padding(.horizontal)
            }
        }
    }

    private var stepInterests: some View {
        ScrollView {
            VStack(spacing: 24) {
                Spacer().frame(height: 32)
                Image(systemName: "heart.text.square.fill").font(.system(size: 56)).foregroundStyle(Theme.accent)
                Text("What interests you?").font(.title2.weight(.bold))
                Text("Select all that apply to get personalized suggestions.")
                    .font(.subheadline).foregroundStyle(Theme.textSecondary).multilineTextAlignment(.center)

                LazyVGrid(columns: [GridItem(.flexible(), spacing: 10), GridItem(.flexible(), spacing: 10)], spacing: 10) {
                    ForEach(interests, id: \.self) { interest in
                        Button { toggleInterest(interest) } label: {
                            HStack(spacing: 6) {
                                Image(systemName: interestIcon(interest))
                                Text(interest)
                            }
                            .font(.subheadline.weight(.medium))
                            .foregroundStyle(selectedInterests.contains(interest) ? .white : Theme.textPrimary)
                            .frame(maxWidth: .infinity).padding(.vertical, 12)
                            .background(selectedInterests.contains(interest) ? Theme.primary : Theme.surface)
                            .clipShape(.rect(cornerRadius: 12))
                        }
                        .buttonStyle(.plain)
                    }
                }
                .padding(.horizontal)

                VStack(alignment: .leading, spacing: 8) {
                    Text("Group Type").font(.caption.weight(.medium)).foregroundStyle(Theme.textSecondary)
                    Picker("Group", selection: $groupType) {
                        ForEach(groupTypes, id: \.self) { Text($0).tag($0) }
                    }
                    .pickerStyle(.segmented)
                }
                .padding(.horizontal)
            }
        }
    }

    private var stepProfile: some View {
        ScrollView {
            VStack(spacing: 24) {
                Spacer().frame(height: 32)
                Image(systemName: "person.text.rectangle.fill").font(.system(size: 56)).foregroundStyle(Theme.info)
                Text("About you").font(.title2.weight(.bold))

                VStack(alignment: .leading, spacing: 14) {
                    VStack(alignment: .leading, spacing: 6) {
                        Text("Nationality").font(.caption.weight(.medium)).foregroundStyle(Theme.textSecondary)
                        TextField("e.g. Kenyan, American, British...", text: $nationality)
                            .padding(12).background(Theme.surface).clipShape(.rect(cornerRadius: 10))
                    }

                    VStack(alignment: .leading, spacing: 6) {
                        Text("Preferred Language").font(.caption.weight(.medium)).foregroundStyle(Theme.textSecondary)
                        Picker("Language", selection: $preferredLanguage) {
                            ForEach(languages, id: \.self) { Text($0).tag($0) }
                        }
                        .pickerStyle(.menu).padding(12).background(Theme.surface).clipShape(.rect(cornerRadius: 10))
                    }
                }
                .padding(.horizontal)
            }
        }
    }

    private var stepCurrency: some View {
        ScrollView {
            VStack(spacing: 24) {
                Spacer().frame(height: 32)
                Image(systemName: "dollarsign.circle.fill").font(.system(size: 56)).foregroundStyle(Theme.success)
                Text("Currency Preference").font(.title2.weight(.bold))
                Text("Prices will show in your preferred currency alongside local currency (KES).")
                    .font(.subheadline).foregroundStyle(Theme.textSecondary).multilineTextAlignment(.center)
                    .padding(.horizontal, 24)

                VStack(spacing: 10) {
                    ForEach(currencies, id: \.self) { cur in
                        Button { preferredCurrency = cur } label: {
                            HStack(spacing: 12) {
                                Text(cur).font(.headline)
                                Text(currencyLabel(cur)).font(.subheadline).foregroundStyle(Theme.textSecondary)
                                Spacer()
                                Image(systemName: preferredCurrency == cur ? "checkmark.circle.fill" : "circle")
                                    .foregroundStyle(preferredCurrency == cur ? Theme.primary : Theme.textSecondary)
                            }
                            .padding().background(Theme.surface).clipShape(.rect(cornerRadius: 12))
                        }
                        .buttonStyle(.plain)
                    }
                }
                .padding(.horizontal)
            }
        }
    }

    // MARK: Helpers

    private func toggleInterest(_ interest: String) {
        if selectedInterests.contains(interest) { selectedInterests.remove(interest) }
        else { selectedInterests.insert(interest) }
    }

    private func interestIcon(_ interest: String) -> String {
        switch interest {
        case "Safari": return "binoculars.fill"
        case "Beach": return "beach.umbrella.fill"
        case "Culture": return "theatermasks.fill"
        case "Food": return "fork.knife"
        case "Nightlife": return "sparkles"
        case "Adventure": return "figure.hiking"
        case "Hiking": return "mountain.2.fill"
        case "Shopping": return "bag.fill"
        default: return "star.fill"
        }
    }

    private func currencyLabel(_ code: String) -> String {
        switch code {
        case "KES": return "Kenyan Shilling"
        case "USD": return "US Dollar"
        case "EUR": return "Euro"
        case "GBP": return "British Pound"
        case "TZS": return "Tanzanian Shilling"
        case "UGX": return "Ugandan Shilling"
        default: return code
        }
    }

    private func complete() {
        app.setTouristMode(true)
        app.setCurrency(preferredCurrency)
        app.completeOnboarding()
        dismiss()
    }
}
