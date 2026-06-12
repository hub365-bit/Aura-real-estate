import SwiftUI

struct FeedView: View {
    @State private var liked: Set<String> = []

    var body: some View {
        NavigationStack {
            ScrollView {
                LazyVStack(spacing: 16) {
                    ForEach(MockData.posts) { post in
                        PostCard(post: post, isLiked: liked.contains(post.id)) {
                            if liked.contains(post.id) { liked.remove(post.id) } else { liked.insert(post.id) }
                        }
                        .padding(.horizontal)
                    }
                }
                .padding(.vertical)
            }
            .background(Theme.background)
            .navigationTitle("Feed")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    NavigationLink(value: "reels") {
                        Image(systemName: "play.rectangle.fill")
                            .foregroundStyle(Theme.accent)
                    }
                }
            }
            .navigationDestination(for: String.self) { _ in ReelsView() }
        }
    }
}

struct PostCard: View {
    let post: Post
    let isLiked: Bool
    let onLike: () -> Void
    @State private var mediaIndex = 0

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(spacing: 10) {
                Avatar(url: post.authorAvatar, size: 42)
                VStack(alignment: .leading, spacing: 1) {
                    HStack(spacing: 4) {
                        Text(post.authorName).font(.subheadline.weight(.semibold))
                        Image(systemName: "checkmark.seal.fill").font(.caption2).foregroundStyle(Theme.primary)
                    }
                    Text(post.authorRole.label).font(.caption).foregroundStyle(Theme.textSecondary)
                }
                Spacer()
                if post.type == "reel" {
                    Label("Reel", systemImage: "play.fill")
                        .font(.caption2.weight(.bold))
                        .foregroundStyle(Theme.accent)
                }
            }

            Text(post.content).font(.subheadline)

            if !post.media.isEmpty {
                TabView(selection: $mediaIndex) {
                    ForEach(Array(post.media.enumerated()), id: \.offset) { idx, url in
                        RemoteImage(url: url, height: 220)
                            .clipShape(.rect(cornerRadius: 12))
                            .tag(idx)
                    }
                }
                .frame(height: 220)
                .tabViewStyle(.page(indexDisplayMode: post.media.count > 1 ? .automatic : .never))
            }

            if !post.hashtags.isEmpty {
                Text(post.hashtags.map { "#\($0)" }.joined(separator: " "))
                    .font(.caption)
                    .foregroundStyle(Theme.primary)
            }

            HStack(spacing: 24) {
                Button(action: onLike) {
                    Label("\(post.likes + (isLiked ? 1 : 0))", systemImage: isLiked ? "heart.fill" : "heart")
                        .foregroundStyle(isLiked ? Theme.accent : Theme.textSecondary)
                }
                Label("\(post.commentsCount)", systemImage: "bubble.right")
                    .foregroundStyle(Theme.textSecondary)
                Label("\(post.sharesCount)", systemImage: "arrowshape.turn.up.right")
                    .foregroundStyle(Theme.textSecondary)
                Spacer()
            }
            .font(.subheadline)
        }
        .auraCard()
    }
}

struct ReelsView: View {
    private var reels: [Post] { MockData.posts.filter { $0.type == "reel" } + MockData.posts }

    var body: some View {
        TabView {
            ForEach(reels) { post in
                ZStack(alignment: .bottomLeading) {
                    RemoteImage(url: post.media.first)
                        .ignoresSafeArea()
                    LinearGradient(colors: [.clear, .black.opacity(0.7)], startPoint: .center, endPoint: .bottom)
                        .ignoresSafeArea()
                    VStack(alignment: .leading, spacing: 8) {
                        HStack {
                            Avatar(url: post.authorAvatar, size: 40)
                            Text(post.authorName).font(.subheadline.weight(.bold)).foregroundStyle(.white)
                        }
                        Text(post.content).font(.footnote).foregroundStyle(.white).lineLimit(3)
                    }
                    .padding()
                    .padding(.bottom, 40)
                }
                .rotationEffect(.degrees(0))
            }
        }
        .tabViewStyle(.page)
        .background(.black)
        .ignoresSafeArea()
        .navigationTitle("Reels")
        .navigationBarTitleDisplayMode(.inline)
        .toolbarColorScheme(.dark, for: .navigationBar)
    }
}
