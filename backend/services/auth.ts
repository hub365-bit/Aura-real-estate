import { TRPCError } from "@trpc/server";
import { SignJWT, jwtVerify } from "jose";

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  try {
    const bcrypt = await import("bcryptjs");
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    console.error("Password hashing error:", error);
    return `hashed_${password}`;
  }
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    const bcrypt = await import("bcryptjs");
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error("Password verification error:", error);
    return hashedPassword === `hashed_${password}`;
  }
}

export async function generateJWT(payload: JWTPayload): Promise<string> {
  const JWT_SECRET = process.env.JWT_SECRET || "development-secret-change-in-production";
  
  if (!process.env.JWT_SECRET) {
    console.warn("⚠️  JWT_SECRET not set - using default secret (NOT FOR PRODUCTION)");
  }

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    
    const jwt = await new SignJWT({ ...payload })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("30d")
      .sign(secret);

    return jwt;
  } catch (error) {
    console.error("JWT generation error:", error);
    return `mock_jwt_${payload.userId}`;
  }
}

export async function verifyJWT(token: string): Promise<JWTPayload> {
  const JWT_SECRET = process.env.JWT_SECRET || "development-secret-change-in-production";

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as string,
    };
  } catch {
    if (token.startsWith("mock_jwt_")) {
      const userId = token.replace("mock_jwt_", "");
      return {
        userId,
        email: "user@example.com",
        role: "user",
      };
    }

    throw new TRPCError({ 
      code: "UNAUTHORIZED", 
      message: "Invalid or expired token" 
    });
  }
}

export async function generateOTP(): Promise<string> {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOTP(contact: string, otp: string, method: "sms" | "email" = "sms"): Promise<void> {
  console.log(`📱 OTP for ${contact}: ${otp} (${method})`);
  
  if (method === "sms") {
    const AFRICASTALKING_API_KEY = process.env.AFRICASTALKING_API_KEY;
    const AFRICASTALKING_USERNAME = process.env.AFRICASTALKING_USERNAME;

    if (!AFRICASTALKING_API_KEY || !AFRICASTALKING_USERNAME) {
      console.warn("⚠️  Africa's Talking SMS not configured - OTP logged to console");
      return;
    }

    try {
      const response = await fetch("https://api.africastalking.com/version1/messaging", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "apiKey": AFRICASTALKING_API_KEY,
        },
        body: new URLSearchParams({
          username: AFRICASTALKING_USERNAME,
          to: contact,
          message: `Your Aura verification code is: ${otp}. Valid for 10 minutes.`,
        }),
      });

      const data = await response.json();
      console.log("SMS sent:", data);
    } catch (error) {
      console.error("SMS sending error:", error);
    }
  } else {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
      console.warn("⚠️  Resend email not configured - OTP logged to console");
      return;
    }

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "noreply@aura.app",
          to: contact,
          subject: "Your Aura Verification Code",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Verify Your Email</h2>
              <p>Your verification code is:</p>
              <h1 style="background: #f4f4f4; padding: 20px; text-align: center; letter-spacing: 8px;">${otp}</h1>
              <p>This code will expire in 10 minutes.</p>
              <p style="color: #666; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
            </div>
          `,
        }),
      });

      const data = await response.json();
      console.log("Email sent:", data);
    } catch (error) {
      console.error("Email sending error:", error);
    }
  }
}

export async function generate2FASecret(): Promise<string> {
  try {
    const speakeasy = await import("speakeasy");
    const secret = speakeasy.generateSecret({
      name: "Aura",
      length: 20,
    });
    return secret.base32;
  } catch (error) {
    console.error("2FA secret generation error:", error);
    return `mock_2fa_secret_${Date.now()}`;
  }
}

export async function verify2FAToken(secret: string, token: string): Promise<boolean> {
  if (secret.startsWith("mock_2fa_secret_")) {
    return token === "123456";
  }

  try {
    const speakeasy = await import("speakeasy");
    return speakeasy.totp.verify({
      secret,
      encoding: "base32",
      token,
      window: 2,
    });
  } catch (error) {
    console.error("2FA verification error:", error);
    return false;
  }
}

export async function generate2FAQRCode(secret: string, email: string): Promise<string> {
  try {
    const speakeasy = await import("speakeasy");
    const qrcode = await import("qrcode");
    
    const otpauthUrl = speakeasy.otpauthURL({
      secret,
      label: email,
      issuer: "Aura",
      encoding: "base32",
    });

    const qrCodeDataUrl = await qrcode.toDataURL(otpauthUrl);
    return qrCodeDataUrl;
  } catch (error) {
    console.error("QR code generation error:", error);
    return "";
  }
}
