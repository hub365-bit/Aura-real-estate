import SwiftUI

// MARK: - Travel Assistant (AI)

struct TravelAssistantView: View {
    @State private var messageText = ""
    @State private var messages: [AssistantMessage] = [
        AssistantMessage(text: "Jambo! 👋 I'm your Aura travel assistant. I can help you find hotels, tours, answer travel questions, or suggest activities. What would you like to know?", isUser: false),
    ]
    @State private var isThinking = false

    var body: some View {
        VStack(spacing: 0) {
            ScrollViewReader { proxy in
                ScrollView {
                    VStack(spacing: 12) {
                        ForEach(messages) { msg in
                            HStack(alignment: .top) {
                                if msg.isUser { Spacer(minLength: 60) }
                                VStack(alignment: msg.isUser ? .trailing : .leading, spacing: 4) {
                                    Text(msg.text)
                                        .font(.subheadline)
                                        .foregroundStyle(msg.isUser ? .white : Theme.textPrimary)
                                        .padding(.horizontal, 14).padding(.vertical, 10)
                                        .background(msg.isUser ? Theme.primary : Theme.surface)
                                        .clipShape(.rect(cornerRadius: 16))
                                }
                                if !msg.isUser { Spacer(minLength: 60) }
                            }
                        }
                        if isThinking {
                            HStack {
                                ProgressView().padding(12).background(Theme.surface).clipShape(.rect(cornerRadius: 16))
                                Spacer()
                            }
                        }
                        Color.clear.frame(height: 1).id("bottom")
                    }
                    .padding()
                }
                .onChange(of: messages.count) { withAnimation { proxy.scrollTo("bottom") } }
            }
            .background(Theme.background)

            // Quick suggestions
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    quickPill("Best hotels in Diani")
                    quickPill("Safari in Maasai Mara")
                    quickPill("Visa requirements")
                    quickPill("Weather this week")
                }
                .padding(.horizontal)
            }
            .padding(.bottom, 8)

            HStack(spacing: 10) {
                TextField("Ask about travel...", text: $messageText)
                    .textFieldStyle(.plain)
                    .padding(.horizontal, 14).padding(.vertical, 10)
                    .background(Theme.surface).clipShape(.rect(cornerRadius: 20))
                Button {
                    guard !messageText.isEmpty else { return }
                    let userMsg = messageText
                    messageText = ""
                    messages.append(AssistantMessage(text: userMsg, isUser: true))
                    isThinking = true
                    DispatchQueue.main.asyncAfter(deadline: .now() + 1.2) {
                        isThinking = false
                        messages.append(AssistantMessage(text: "Great question! Based on current availability and reviews, I'd recommend checking out Diani Reef Beach Resort (4.8★) for a beach stay, or the Maasai Mara 3-Day Safari for an unforgettable wildlife experience. Would you like more details on either?", isUser: false))
                    }
                } label: {
                    Image(systemName: "arrow.up.circle.fill")
                        .font(.title2).foregroundStyle(Theme.primary)
                }
                .disabled(messageText.isEmpty)
            }
            .padding(.horizontal).padding(.vertical, 8)
            .background(.ultraThinMaterial)
        }
        .navigationTitle("AI Assistant")
        .navigationBarTitleDisplayMode(.inline)
    }

    private func quickPill(_ text: String) -> some View {
        Button {
            messages.append(AssistantMessage(text: text, isUser: true))
            isThinking = true
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
                isThinking = false
                messages.append(AssistantMessage(text: "I've found some great options for you! Let me know if you'd like to filter by budget, dates, or specific amenities. 🏖️", isUser: false))
            }
        } label: {
            Text(text).font(.caption.weight(.medium)).foregroundStyle(Theme.primary)
                .padding(.horizontal, 12).padding(.vertical, 7)
                .background(Theme.primary.opacity(0.08)).clipShape(Capsule())
        }
    }
}

struct AssistantMessage: Identifiable {
    let id = UUID()
    var text: String
    var isUser: Bool
}
