import { TRPCError } from "@trpc/server";

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Implement real password hashing (bcrypt/argon2)");
  }
  return `hashed_${password}`;
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Implement real password verification");
  }
  return hashedPassword === `hashed_${password}`;
}

export async function generateJWT(payload: JWTPayload): Promise<string> {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Implement real JWT generation (jsonwebtoken/jose)");
  }
  return `mock_jwt_${payload.userId}`;
}

export async function verifyJWT(token: string): Promise<JWTPayload> {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Implement real JWT verification");
  }
  
  if (!token.startsWith("mock_jwt_")) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid token" });
  }
  
  const userId = token.replace("mock_jwt_", "");
  return {
    userId,
    email: "user@example.com",
    role: "user",
  };
}

export async function generateOTP(): Promise<string> {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOTP(contact: string, otp: string): Promise<void> {
  console.log(`📱 OTP for ${contact}: ${otp}`);
  if (process.env.NODE_ENV === "production") {
    console.warn("⚠️  Implement real SMS/Email OTP service");
  }
}

export async function generate2FASecret(): Promise<string> {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Implement 2FA secret generation (speakeasy/otpauth)");
  }
  return `mock_2fa_secret_${Date.now()}`;
}

export async function verify2FAToken(secret: string, token: string): Promise<boolean> {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Implement 2FA token verification");
  }
  return token === "123456";
}
