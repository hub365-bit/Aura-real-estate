import SwiftUI

// MARK: - Subscription

struct SubscriptionView: View {
    @State private var selected: SubscriptionTier = .monthly

    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                VStack(spacing: 6) {
                    Image(systemName: "crown.fill").font(.system(size: 40)).foregroundStyle(.white)
                    Text("Aura Pro").font(.title.weight(.bold)).foregroundStyle(.white)
                    Text("Grow your business faster").font(.subheadline).foregroundStyle(.white.opacity(0.9))
                }
                .frame(maxWidth: .infinity).padding(.vertical, 28)
                .background(Theme.sunsetGradient).clipShape(.rect(cornerRadius: 20))

                ForEach(MockData.subscriptionPlans) { plan in
                    planCard(plan)
                }

                Button {
                } label: {
                    Text("Continue")
                        .font(.headline).foregroundStyle(.white)
                        .frame(maxWidth: .infinity).padding()
                        .background(Theme.primary).clipShape(.rect(cornerRadius: 14))
                }
            }
            .padding()
        }
        .background(Theme.background)
        .navigationTitle("Subscription")
        .navigationBarTitleDisplayMode(.inline)
    }

    private func planCard(_ plan: SubscriptionPlan) -> some View {
        Button { selected = plan.tier } label: {
            VStack(alignment: .leading, spacing: 10) {
                HStack {
                    VStack(alignment: .leading, spacing: 2) {
                        Text(plan.tier.rawValue.capitalized).font(.headline)
                        Text("KSh \(plan.price.formatted())/\(plan.period)").font(.subheadline).foregroundStyle(Theme.primary)
                    }
                    Spacer()
                    if plan.highlighted {
                        Text("POPULAR").font(.caption2.weight(.bold)).foregroundStyle(.white)
                            .padding(.horizontal, 10).padding(.vertical, 4)
                            .background(Theme.accent).clipShape(Capsule())
                    }
                    Image(systemName: selected == plan.tier ? "checkmark.circle.fill" : "circle")
                        .foregroundStyle(selected == plan.tier ? Theme.primary : Theme.textSecondary)
                }
                ForEach(plan.features, id: \.self) { feature in
                    Label(feature, systemImage: "checkmark").font(.caption).foregroundStyle(Theme.textSecondary)
                }
            }
            .padding()
            .background(Theme.surface)
            .clipShape(.rect(cornerRadius: 16))
            .overlay(RoundedRectangle(cornerRadius: 16).stroke(selected == plan.tier ? Theme.primary : .clear, lineWidth: 2))
        }
        .buttonStyle(.plain)
    }
}

// MARK: - Payments

struct PaymentsView: View {
    private let history = [
        ("Property booking deposit", "-KSh 85,000", "Oct 30", Theme.textPrimary),
        ("Service - Deep cleaning", "-KSh 8,000", "Nov 2", Theme.textPrimary),
        ("Escrow refund", "+KSh 3,000", "Nov 5", Theme.success),
        ("Subscription - Monthly", "-KSh 1,500", "Nov 6", Theme.textPrimary),
    ]

    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                VStack(spacing: 6) {
                    Text("Wallet Balance").font(.caption).foregroundStyle(.white.opacity(0.9))
                    Text("KSh 12,400").font(.system(size: 36, weight: .bold)).foregroundStyle(.white)
                    HStack(spacing: 12) {
                        walletButton("Top Up", "plus")
                        walletButton("Withdraw", "arrow.down")
                    }
                    .padding(.top, 8)
                }
                .frame(maxWidth: .infinity).padding(.vertical, 24)
                .background(Theme.brandGradient).clipShape(.rect(cornerRadius: 20))

                VStack(alignment: .leading, spacing: 12) {
                    Text("Payment Methods").font(.headline)
                    HStack {
                        Image(systemName: "creditcard.fill").foregroundStyle(Theme.primary)
                        Text("M-Pesa · 0712****56").font(.subheadline)
                        Spacer()
                        Text("Default").font(.caption).foregroundStyle(Theme.success)
                    }
                    Divider()
                    HStack {
                        Image(systemName: "creditcard.fill").foregroundStyle(Theme.info)
                        Text("Visa · **** 4242").font(.subheadline)
                        Spacer()
                    }
                }
                .auraCard()

                VStack(alignment: .leading, spacing: 12) {
                    Text("Recent Transactions").font(.headline)
                    ForEach(history, id: \.0) { item in
                        HStack {
                            VStack(alignment: .leading, spacing: 2) {
                                Text(item.0).font(.subheadline)
                                Text(item.2).font(.caption).foregroundStyle(Theme.textSecondary)
                            }
                            Spacer()
                            Text(item.1).font(.subheadline.weight(.semibold)).foregroundStyle(item.3)
                        }
                        if item.0 != history.last?.0 { Divider() }
                    }
                }
                .auraCard()
            }
            .padding()
        }
        .background(Theme.background)
        .navigationTitle("Payments")
        .navigationBarTitleDisplayMode(.inline)
    }

    private func walletButton(_ title: String, _ icon: String) -> some View {
        Label(title, systemImage: icon)
            .font(.caption.weight(.semibold)).foregroundStyle(.white)
            .padding(.horizontal, 16).padding(.vertical, 8)
            .background(.white.opacity(0.2)).clipShape(Capsule())
    }
}

// MARK: - Smart Billing

struct SmartBillingView: View {
    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                HStack {
                    billStat("KSh 165k", "Collected", Theme.success)
                    billStat("KSh 60k", "Outstanding", Theme.warning)
                    billStat("3", "Tenants", Theme.primary)
                }
                .auraCard()

                HStack {
                    Text("Rent Invoices").font(.headline)
                    Spacer()
                    Button { } label: {
                        Label("Export KRA", systemImage: "square.and.arrow.up")
                            .font(.caption.weight(.semibold))
                    }
                }
                .padding(.horizontal, 4)

                ForEach(MockData.invoices) { invoice in
                    invoiceCard(invoice)
                }
            }
            .padding()
        }
        .background(Theme.background)
        .navigationTitle("Smart Billing")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button { } label: { Image(systemName: "plus") }
            }
        }
    }

    private func billStat(_ value: String, _ label: String, _ color: Color) -> some View {
        VStack(spacing: 4) {
            Text(value).font(.subheadline.weight(.bold)).foregroundStyle(color)
            Text(label).font(.caption2).foregroundStyle(Theme.textSecondary)
        }
        .frame(maxWidth: .infinity)
    }

    private func invoiceCard(_ invoice: RentInvoice) -> some View {
        let statusColor: Color = {
            switch invoice.status {
            case "paid": return Theme.success
            case "partial": return Theme.warning
            case "overdue": return Theme.error
            default: return Theme.textSecondary
            }
        }()
        return VStack(alignment: .leading, spacing: 10) {
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text(invoice.tenantName).font(.subheadline.weight(.semibold))
                    Text(invoice.propertyTitle).font(.caption).foregroundStyle(Theme.textSecondary)
                }
                Spacer()
                Text(invoice.status.capitalized)
                    .font(.caption.weight(.bold)).foregroundStyle(statusColor)
                    .padding(.horizontal, 10).padding(.vertical, 4)
                    .background(statusColor.opacity(0.12)).clipShape(Capsule())
            }
            Divider()
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text("KSh \(invoice.amount.formatted())").font(.subheadline.weight(.bold)).foregroundStyle(Theme.primary)
                    if invoice.paidAmount > 0 && invoice.paidAmount < invoice.amount {
                        Text("Paid KSh \(invoice.paidAmount.formatted())").font(.caption2).foregroundStyle(Theme.textSecondary)
                    }
                    if invoice.lateFee > 0 {
                        Text("+ KSh \(invoice.lateFee.formatted()) late fee").font(.caption2).foregroundStyle(Theme.error)
                    }
                }
                Spacer()
                VStack(alignment: .trailing, spacing: 2) {
                    Text("Due").font(.caption2).foregroundStyle(Theme.textSecondary)
                    Text(invoice.dueDate).font(.caption).foregroundStyle(Theme.textSecondary)
                }
            }
        }
        .auraCard()
    }
}

// MARK: - Tenant Profile

struct TenantProfileView: View {
    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                VStack(spacing: 10) {
                    Avatar(url: MockData.currentUser.avatar, size: 80)
                    Text(MockData.currentUser.name).font(.title3.weight(.bold))
                    HStack(spacing: 6) {
                        Image(systemName: "checkmark.seal.fill").foregroundStyle(Theme.success)
                        Text("Verified Tenant").font(.subheadline).foregroundStyle(Theme.success)
                    }
                }
                .frame(maxWidth: .infinity).padding(.vertical, 8)

                VStack(alignment: .leading, spacing: 12) {
                    Text("Payment Reliability").font(.headline)
                    HStack {
                        Text("96%").font(.system(size: 36, weight: .bold)).foregroundStyle(Theme.success)
                        Spacer()
                        VStack(alignment: .trailing) {
                            Text("Excellent").font(.subheadline.weight(.semibold)).foregroundStyle(Theme.success)
                            Text("On-time payments").font(.caption).foregroundStyle(Theme.textSecondary)
                        }
                    }
                    ProgressView(value: 0.96).tint(Theme.success)
                }
                .auraCard()

                VStack(alignment: .leading, spacing: 12) {
                    Text("Rental History").font(.headline)
                    historyRow("3BR Apartment, Kilimani", "2024 - Present", 5)
                    Divider()
                    historyRow("2BR Bungalow, Ngong", "2022 - 2024", 4)
                }
                .auraCard()

                VStack(alignment: .leading, spacing: 12) {
                    Text("Host Reviews").font(.headline)
                    reviewRow("Sarah Mutua", "Reliable tenant, always pays on time. Highly recommend!", 5)
                    Divider()
                    reviewRow("John Kamau", "Took great care of the property. Would rent to again.", 5)
                }
                .auraCard()
            }
            .padding()
        }
        .background(Theme.background)
        .navigationTitle("Tenant Profile")
        .navigationBarTitleDisplayMode(.inline)
    }

    private func historyRow(_ title: String, _ period: String, _ stars: Int) -> some View {
        HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text(title).font(.subheadline.weight(.medium))
                Text(period).font(.caption).foregroundStyle(Theme.textSecondary)
            }
            Spacer()
            HStack(spacing: 1) {
                ForEach(0..<stars, id: \.self) { _ in
                    Image(systemName: "star.fill").font(.caption2).foregroundStyle(Theme.secondary)
                }
            }
        }
    }

    private func reviewRow(_ name: String, _ comment: String, _ stars: Int) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack {
                Text(name).font(.subheadline.weight(.semibold))
                Spacer()
                HStack(spacing: 1) {
                    ForEach(0..<stars, id: \.self) { _ in
                        Image(systemName: "star.fill").font(.caption2).foregroundStyle(Theme.secondary)
                    }
                }
            }
            Text(comment).font(.caption).foregroundStyle(Theme.textSecondary)
        }
    }
}
