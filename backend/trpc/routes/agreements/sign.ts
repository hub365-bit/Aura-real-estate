import { z } from "zod";
import { publicProcedure } from "../../create-context";
import { DigitalAgreement } from "../../../db/schema";

export const signAgreementProcedure = publicProcedure
  .input(
    z.object({
      agreementId: z.string(),
      userId: z.string(),
      signature: z.string().optional(),
    })
  )
  .mutation(async ({ input }): Promise<DigitalAgreement> => {
    console.log("📜 Signing agreement:", input.agreementId);

    const allSigned = true;

    const agreement: DigitalAgreement = {
      id: input.agreementId,
      type: "rental",
      propertyId: "prop_123",
      parties: [
        {
          userId: input.userId,
          role: "tenant",
          signed: true,
          signedAt: new Date(),
        },
        {
          userId: "landlord_456",
          role: "landlord",
          signed: true,
          signedAt: new Date(),
        },
      ],
      status: allSigned ? "signed" : "pending_signature",
      documentUrl: `https://aura-agreements.com/agreements/${input.agreementId}.pdf`,
      terms: {},
      createdAt: new Date(Date.now() - 86400000),
    };

    console.log("✅ Agreement signed successfully");
    return agreement;
  });
