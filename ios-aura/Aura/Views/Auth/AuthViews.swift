import SwiftUI

// MARK: - Authentication Flow

struct LoginView: View {
    @State private var email = ""
    @State private var password = ""
    @State private var showPassword = false
    @State private var isLoading = false
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                VStack(spacing: 8) {
                    Image(systemName: "house.lodge.fill")
                        .font(.system(size: 48))
                        .foregroundStyle(Theme.primary)
                    Text("Welcome to Aura").font(.title.weight(.bold))
                    Text("Kenya's unified property, tourism & services platform")
                        .font(.subheadline).foregroundStyle(Theme.textSecondary).multilineTextAlignment(.center)
                }
                .padding(.vertical, 24)

                VStack(spacing: 14) {
                    VStack(alignment: .leading, spacing: 6) {
                        Text("Email").font(.caption.weight(.medium)).foregroundStyle(Theme.textSecondary)
                        TextField("you@example.com", text: $email)
                            .textContentType(.emailAddress).keyboardType(.emailAddress).autocapitalization(.none)
                            .padding(12).background(Theme.surface).clipShape(.rect(cornerRadius: 10))
                    }
                    VStack(alignment: .leading, spacing: 6) {
                        Text("Password").font(.caption.weight(.medium)).foregroundStyle(Theme.textSecondary)
                        HStack {
                            if showPassword {
                                TextField("Password", text: $password)
                            } else {
                                SecureField("Password", text: $password)
                            }
                            Button { showPassword.toggle() } label: {
                                Image(systemName: showPassword ? "eye.slash.fill" : "eye.fill")
                                    .foregroundStyle(Theme.textSecondary)
                            }
                        }
                        .padding(12).background(Theme.surface).clipShape(.rect(cornerRadius: 10))
                    }
                }

                Button {
                    isLoading = true
                    DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) { isLoading = false; dismiss() }
                } label: {
                    HStack {
                        if isLoading { ProgressView().tint(.white) }
                        Text("Sign In").font(.headline)
                    }
                    .foregroundStyle(.white).frame(maxWidth: .infinity).padding(14)
                    .background(Theme.primary).clipShape(.rect(cornerRadius: 14))
                }
                .disabled(isLoading || email.isEmpty || password.isEmpty)

                HStack(spacing: 4) {
                    Text("Don't have an account?").font(.subheadline).foregroundStyle(Theme.textSecondary)
                    NavigationLink("Sign Up") { SignupView() }.font(.subheadline.weight(.semibold)).foregroundStyle(Theme.primary)
                }

                Divider().padding(.horizontal)

                VStack(spacing: 10) {
                    socialButton("Continue with Google", "g.circle.fill", .blue)
                    socialButton("Continue with Apple", "apple.logo", Theme.textPrimary)
                }
            }
            .padding(24)
        }
        .background(Theme.background)
        .navigationTitle("Sign In")
        .navigationBarTitleDisplayMode(.inline)
    }

    private func socialButton(_ title: String, _ icon: String, _ color: Color) -> some View {
        Button {} label: {
            HStack(spacing: 10) {
                Image(systemName: icon).font(.title3).foregroundStyle(color)
                Text(title).font(.subheadline.weight(.medium)).foregroundStyle(Theme.textPrimary)
            }
            .frame(maxWidth: .infinity).padding(12)
            .background(Theme.surface).clipShape(.rect(cornerRadius: 12))
            .overlay(RoundedRectangle(cornerRadius: 12).stroke(Theme.separator, lineWidth: 1))
        }
    }
}

// MARK: - Signup

struct SignupView: View {
    @State private var name = ""
    @State private var email = ""
    @State private var phone = ""
    @State private var password = ""
    @State private var role: UserRole = .user
    @State private var isLoading = false
    @State private var showOTP = false
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                Text("Create Account").font(.title.weight(.bold)).padding(.top, 20)
                Text("Join Aura to discover properties, book services, and explore Kenya.")
                    .font(.subheadline).foregroundStyle(Theme.textSecondary).multilineTextAlignment(.center)

                VStack(spacing: 14) {
                    fieldRow("Full Name", $name, "person.fill")
                    fieldRow("Email", $email, "envelope.fill")
                        .textContentType(.emailAddress).keyboardType(.emailAddress)
                    fieldRow("Phone (+254)", $phone, "phone.fill")
                        .keyboardType(.phonePad)
                    secureFieldRow("Password", $password)

                    VStack(alignment: .leading, spacing: 6) {
                        Text("I am a...").font(.caption.weight(.medium)).foregroundStyle(Theme.textSecondary)
                        Picker("Role", selection: $role) {
                            ForEach([UserRole.user, .agent, .landlord, .hotel, .tourist], id: \.self) {
                                Text($0.label).tag($0)
                            }
                        }
                        .pickerStyle(.segmented)
                    }
                }

                Button {
                    isLoading = true
                    DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) { isLoading = false; showOTP = true }
                } label: {
                    HStack {
                        if isLoading { ProgressView().tint(.white) }
                        Text("Create Account").font(.headline)
                    }
                    .foregroundStyle(.white).frame(maxWidth: .infinity).padding(14)
                    .background(Theme.primary).clipShape(.rect(cornerRadius: 14))
                }
                .disabled(isLoading || name.isEmpty || email.isEmpty || password.isEmpty)
            }
            .padding(24)
        }
        .background(Theme.background)
        .navigationTitle("Sign Up")
        .navigationBarTitleDisplayMode(.inline)
        .sheet(isPresented: $showOTP) { OTPVerificationView(email: email) { dismiss() } }
    }

    private func fieldRow(_ label: String, _ text: Binding<String>, _ icon: String) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(label).font(.caption.weight(.medium)).foregroundStyle(Theme.textSecondary)
            HStack {
                Image(systemName: icon).foregroundStyle(Theme.textSecondary).frame(width: 20)
                TextField(label, text: text)
            }
            .padding(12).background(Theme.surface).clipShape(.rect(cornerRadius: 10))
        }
    }

    private func secureFieldRow(_ label: String, _ text: Binding<String>) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(label).font(.caption.weight(.medium)).foregroundStyle(Theme.textSecondary)
            HStack {
                Image(systemName: "lock.fill").foregroundStyle(Theme.textSecondary).frame(width: 20)
                SecureField(label, text: text)
            }
            .padding(12).background(Theme.surface).clipShape(.rect(cornerRadius: 10))
        }
    }
}

// MARK: - OTP Verification

struct OTPVerificationView: View {
    let email: String
    var onComplete: () -> Void
    @State private var code = ""
    @State private var isVerifying = false
    @State private var errorMessage: String? = nil

    var body: some View {
        VStack(spacing: 24) {
            Spacer()
            Image(systemName: "envelope.badge.shield.halffill").font(.system(size: 56)).foregroundStyle(Theme.primary)
            Text("Verify Your Email").font(.title2.weight(.bold))
            Text("We've sent a 6-digit code to\n\(email)").font(.subheadline).foregroundStyle(Theme.textSecondary).multilineTextAlignment(.center)

            HStack(spacing: 10) {
                ForEach(0..<6) { i in
                    RoundedRectangle(cornerRadius: 10).fill(Theme.surface)
                        .frame(width: 44, height: 52)
                        .overlay(
                            Text(i < code.count ? String(Array(code)[i]) : "")
                                .font(.title2.weight(.bold))
                        )
                }
            }

            TextField("Code", text: $code)
                .keyboardType(.numberPad).frame(width: 0, height: 0).opacity(0)
                .onChange(of: code) { _, new in
                    let filtered = new.filter { $0.isNumber }
                    if filtered.count > 6 { code = String(filtered.prefix(6)) } else { code = filtered }
                    if code.count == 6 { verify() }
                }

            if let error = errorMessage {
                Text(error).font(.caption).foregroundStyle(Theme.error)
            }

            if isVerifying {
                ProgressView()
            }

            Button("Resend Code") {}.font(.subheadline.weight(.medium)).foregroundStyle(Theme.primary)

            Spacer()
        }
        .padding()
        .background(Theme.background)
        .onAppear { code = "" }
    }

    private func verify() {
        isVerifying = true; errorMessage = nil
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
            isVerifying = false
            if code == "123456" { onComplete() } else { errorMessage = "Invalid code. Try again."; code = "" }
        }
    }
}
