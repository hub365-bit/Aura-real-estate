import SwiftUI

struct ChatView: View {
    let participantName: String
    let conversationId: String
    @State private var draft = ""
    @State private var messages: [ChatMessage] = []
    @State private var showTyping = true

    var body: some View {
        VStack(spacing: 0) {
            ScrollViewReader { proxy in
                ScrollView {
                    LazyVStack(spacing: 10) {
                        ForEach(messages) { message in
                            messageBubble(message).id(message.id)
                        }
                        if showTyping {
                            typingIndicator.id("typing")
                        }
                    }
                    .padding()
                }
                .onChange(of: messages.count) { _, _ in
                    withAnimation { proxy.scrollTo(messages.last?.id, anchor: .bottom) }
                }
            }
            inputBar
        }
        .background(Theme.background)
        .navigationTitle(participantName)
        .navigationBarTitleDisplayMode(.inline)
        .onAppear {
            messages = MockData.messages(for: conversationId)
            DispatchQueue.main.asyncAfter(deadline: .now() + 2) { showTyping = false }
        }
    }

    private func messageBubble(_ message: ChatMessage) -> some View {
        HStack {
            if message.isMine { Spacer(minLength: 40) }
            VStack(alignment: message.isMine ? .trailing : .leading, spacing: 2) {
                Text(message.content)
                    .font(.subheadline)
                    .foregroundStyle(message.isMine ? .white : Theme.textPrimary)
                    .padding(.horizontal, 14).padding(.vertical, 10)
                    .background(message.isMine ? AnyShapeStyle(Theme.primary) : AnyShapeStyle(Theme.surface))
                    .clipShape(.rect(cornerRadius: 16))
                HStack(spacing: 3) {
                    Text(message.createdAt).font(.caption2).foregroundStyle(Theme.textSecondary)
                    if message.isMine {
                        Image(systemName: message.read ? "checkmark.circle.fill" : "checkmark.circle")
                            .font(.caption2)
                            .foregroundStyle(message.read ? Theme.primary : Theme.textSecondary)
                    }
                }
            }
            if !message.isMine { Spacer(minLength: 40) }
        }
    }

    private var typingIndicator: some View {
        HStack {
            HStack(spacing: 4) {
                ForEach(0..<3) { i in
                    Circle().fill(Theme.textSecondary)
                        .frame(width: 6, height: 6)
                        .opacity(0.5)
                        .animation(.easeInOut(duration: 0.6).repeatForever().delay(Double(i) * 0.2), value: showTyping)
                }
            }
            .padding(.horizontal, 14).padding(.vertical, 12)
            .background(Theme.surface)
            .clipShape(.rect(cornerRadius: 16))
            Spacer()
        }
    }

    private var inputBar: some View {
        HStack(spacing: 10) {
            Button { } label: {
                Image(systemName: "plus.circle.fill")
                    .font(.title2)
                    .foregroundStyle(Theme.primary)
            }
            TextField("Message...", text: $draft, axis: .vertical)
                .padding(.horizontal, 14).padding(.vertical, 9)
                .background(Theme.surface)
                .clipShape(.rect(cornerRadius: 20))
            Button { send() } label: {
                Image(systemName: "arrow.up.circle.fill")
                    .font(.title)
                    .foregroundStyle(draft.isEmpty ? Theme.textSecondary : Theme.primary)
            }
            .disabled(draft.isEmpty)
        }
        .padding(.horizontal)
        .padding(.vertical, 8)
        .background(.ultraThinMaterial)
    }

    private func send() {
        let text = draft.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !text.isEmpty else { return }
        messages.append(ChatMessage(id: UUID().uuidString, senderId: "u10", content: text, createdAt: "Now", read: false, isMine: true))
        draft = ""
    }
}
