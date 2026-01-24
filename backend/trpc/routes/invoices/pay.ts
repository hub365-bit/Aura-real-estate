import { publicProcedure } from "../../create-context";
import { z } from "zod";

export const payInvoiceProcedure = publicProcedure
  .input(z.object({
    invoiceId: z.string(),
    amount: z.number().positive(),
    paymentMethod: z.string(),
  }))
  .mutation(async ({ input, ctx }) => {
    const { invoiceId, amount, paymentMethod } = input;

    console.log(`[Invoice] Payment: ${invoiceId}`, { amount, paymentMethod });

    return {
      success: true,
      paidAt: new Date().toISOString(),
      message: 'Payment processed successfully',
    };
  });
