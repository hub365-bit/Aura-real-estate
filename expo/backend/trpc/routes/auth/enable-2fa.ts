import { z } from "zod";
import { protectedProcedure } from "../../create-context";
import { db } from "../../../db/mock-db";

export const enable2faProcedure = protectedProcedure
  .input(
    z.object({
      enable: z.boolean(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const user = db.getUser(ctx.userId);
    
    if (!user) {
      throw new Error("User not found");
    }

    db.updateUser(user.id, { twoFactorEnabled: input.enable });

    const secret = input.enable ? generateSecret() : undefined;
    const qrCode = input.enable ? generateQRCode(user.email, secret!) : undefined;

    return {
      success: true,
      twoFactorEnabled: input.enable,
      secret,
      qrCode,
      message: input.enable 
        ? "Two-factor authentication enabled. Scan the QR code with your authenticator app."
        : "Two-factor authentication disabled.",
    };
  });

function generateSecret(): string {
  return `SECRET${Math.random().toString(36).substring(2, 18).toUpperCase()}`;
}

function generateQRCode(email: string, secret: string): string {
  const otpauthUrl = `otpauth://totp/Aura:${email}?secret=${secret}&issuer=Aura`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauthUrl)}`;
}
