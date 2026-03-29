import { z } from "zod";
import { protectedProcedure } from "../../create-context";
import { db } from "../../../db/mock-db";

export const createPaymentProcedure = protectedProcedure
  .input(
    z.object({
      bookingId: z.string().optional(),
      subscriptionId: z.string().optional(),
      amount: z.number().positive(),
      currency: z.string().default("KSh"),
      method: z.enum(["mpesa", "stripe", "paypal", "card"]),
      metadata: z.record(z.string(), z.unknown()).optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const payment = db.createPayment({
      id: generateId(),
      userId: ctx.userId,
      bookingId: input.bookingId,
      subscriptionId: input.subscriptionId,
      amount: input.amount,
      currency: input.currency,
      method: input.method,
      status: "pending",
      metadata: input.metadata,
      createdAt: new Date(),
    });

    if (input.method === "mpesa") {
      setTimeout(() => {
        const updated = db.getPayments(ctx.userId).find(p => p.id === payment.id);
        if (updated) {
          updated.status = "completed";
          updated.transactionId = `MPESA-${Date.now()}`;
        }
      }, 2000);
    }

    return {
      success: true,
      payment,
    };
  });

function generateId(): string {
  return `pay-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}
