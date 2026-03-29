import { publicProcedure } from "../../create-context";
import { z } from "zod";

export const listInvoicesProcedure = publicProcedure
  .input(z.object({
    tenantId: z.string().optional(),
    landlordId: z.string().optional(),
  }))
  .query(async ({ input, ctx }) => {
    const { tenantId, landlordId } = input;

    console.log(`[Invoices] Listing`, { tenantId, landlordId });

    return {
      invoices: [],
      total: 0,
    };
  });
