import { z } from "zod";
import { publicProcedure } from "../../create-context";
import { RentInvoice } from "../../../db/schema";

export const listInvoicesProcedure = publicProcedure
  .input(
    z.object({
      userId: z.string(),
      role: z.enum(["tenant", "landlord"]),
    })
  )
  .query(async ({ input }): Promise<RentInvoice[]> => {
    console.log("🧾 Fetching invoices for user:", input.userId);

    const mockInvoices: RentInvoice[] = [
      {
        id: "invoice_1",
        tenantId: input.role === "tenant" ? input.userId : "tenant_123",
        landlordId: input.role === "landlord" ? input.userId : "landlord_456",
        propertyId: "prop_789",
        month: "2026-01",
        amount: 15000,
        currency: "KES",
        dueDate: new Date("2026-01-05"),
        paidDate: new Date("2026-01-03"),
        status: "paid",
        partialPayments: [],
        generatedAt: new Date("2025-12-28"),
      },
      {
        id: "invoice_2",
        tenantId: input.role === "tenant" ? input.userId : "tenant_123",
        landlordId: input.role === "landlord" ? input.userId : "landlord_456",
        propertyId: "prop_789",
        month: "2026-02",
        amount: 15000,
        currency: "KES",
        dueDate: new Date("2026-02-05"),
        status: "pending",
        partialPayments: [],
        generatedAt: new Date("2026-01-28"),
      },
    ];

    return mockInvoices;
  });
