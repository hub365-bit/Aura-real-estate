import { z } from "zod";
import { publicProcedure } from "../../create-context";
import { DigitalAgreement } from "../../../db/schema";

export const createAgreementProcedure = publicProcedure
  .input(
    z.object({
      type: z.enum(["rental", "booking", "service"]),
      bookingId: z.string().optional(),
      propertyId: z.string().optional(),
      parties: z.array(
        z.object({
          userId: z.string(),
          role: z.string(),
          signed: z.boolean().optional(),
          signedAt: z.date().optional(),
        })
      ),
      terms: z.record(z.unknown()),
      expiresAt: z.date().optional(),
    })
  )
  .mutation(async ({ input }): Promise<DigitalAgreement> => {
    console.log("📜 Creating digital agreement:", input);

    const agreement: DigitalAgreement = {
      id: `agreement_${Date.now()}`,
      type: input.type,
      bookingId: input.bookingId,
      propertyId: input.propertyId,
      parties: input.parties.map((p) => ({
        ...p,
        signed: false,
      })),
      status: "pending_signature",
      documentUrl: `https://aura-agreements.com/agreements/${Date.now()}.pdf`,
      terms: input.terms,
      createdAt: new Date(),
      expiresAt: input.expiresAt,
    };

    console.log("✅ Digital agreement created");
    return agreement;
  });
