import { publicProcedure } from "../../create-context";
import { z } from "zod";

export const createInvoiceProcedure = publicProcedure
  .input(z.object({
    tenantId: z.string(),
    landlordId: z.string(),
    propertyId: z.string(),
    amount: z.number().positive(),
    currency: z.string().default('KES'),
    dueDate: z.string(),
  }))
  .mutation(async ({ input, ctx }) => {
    const { tenantId, landlordId, propertyId, amount, currency, dueDate } = input;

    const invoiceId = `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    console.log(`[Invoice] Created: ${invoiceId}`, { tenantId, amount });

    return {
      id: invoiceId,
      tenantId,
      landlordId,
      propertyId,
      amount,
      currency,
      dueDate,
      paidAmount: 0,
      lateFee: 0,
      status: 'unpaid' as const,
      createdAt: new Date().toISOString(),
    };
  });
