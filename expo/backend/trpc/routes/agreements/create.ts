import { publicProcedure } from "../../create-context";
import { z } from "zod";

export const createAgreementProcedure = publicProcedure
  .input(z.object({
    type: z.enum(['rental', 'booking', 'service']),
    bookingId: z.string().optional(),
    propertyId: z.string().optional(),
    parties: z.array(z.object({
      userId: z.string(),
      name: z.string(),
      role: z.string(),
    })),
    content: z.string(),
  }))
  .mutation(async ({ input, ctx }) => {
    const { type, bookingId, propertyId, parties, content } = input;

    const agreementId = `agr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    console.log(`[Agreement] Created: ${agreementId}`, { type, bookingId, propertyId });

    return {
      id: agreementId,
      type,
      bookingId,
      propertyId,
      parties: parties.map(p => ({ ...p, signed: false })),
      content,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    };
  });
