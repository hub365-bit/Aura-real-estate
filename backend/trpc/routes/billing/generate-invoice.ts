import { z } from "zod";
import { publicProcedure } from "../../create-context";
import { RentInvoice } from "../../../db/schema";

export const generateInvoiceProcedure = publicProcedure
  .input(
    z.object({
      tenantId: z.string(),
      landlordId: z.string(),
      propertyId: z.string(),
      month: z.string(),
      amount: z.number(),
      currency: z.string(),
      dueDate: z.date(),
    })
  )
  .mutation(async ({ input }): Promise<RentInvoice> => {
    console.log("🧾 Generating rent invoice:", input);

    const invoice: RentInvoice = {
      id: `invoice_${Date.now()}`,
      tenantId: input.tenantId,
      landlordId: input.landlordId,
      propertyId: input.propertyId,
      month: input.month,
      amount: input.amount,
      currency: input.currency,
      dueDate: input.dueDate,
      status: "pending",
      partialPayments: [],
      generatedAt: new Date(),
    };

    console.log("✅ Invoice generated successfully");
    return invoice;
  });
