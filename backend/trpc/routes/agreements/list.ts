import { z } from "zod";
import { publicProcedure } from "../../create-context";
import { DigitalAgreement } from "../../../db/schema";

export const listAgreementsProcedure = publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ input }): Promise<DigitalAgreement[]> => {
    console.log("📜 Fetching agreements for user:", input.userId);

    const mockAgreements: DigitalAgreement[] = [
      {
        id: "agreement_1",
        type: "rental",
        propertyId: "prop_123",
        parties: [
          {
            userId: input.userId,
            role: "tenant",
            signed: true,
            signedAt: new Date(Date.now() - 86400000),
          },
          {
            userId: "landlord_456",
            role: "landlord",
            signed: true,
            signedAt: new Date(Date.now() - 86400000),
          },
        ],
        status: "active",
        documentUrl: "https://aura-agreements.com/agreements/agreement_1.pdf",
        terms: { rentAmount: 15000, duration: "12 months" },
        createdAt: new Date(Date.now() - 86400000 * 30),
      },
    ];

    return mockAgreements;
  });
