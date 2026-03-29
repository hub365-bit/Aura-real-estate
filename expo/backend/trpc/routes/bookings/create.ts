import { z } from "zod";
import { protectedProcedure } from "../../create-context";
import { db } from "../../../db/mock-db";

export const createBookingProcedure = protectedProcedure
  .input(
    z.object({
      propertyId: z.string().optional(),
      serviceId: z.string().optional(),
      roomNumber: z.string().optional(),
      checkIn: z.date(),
      checkOut: z.date(),
      guests: z.number().positive(),
      specialRequests: z.string().optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const property = input.propertyId ? db.getProperty(input.propertyId) : null;
    const totalPrice = property ? property.price : 10000;

    const booking = db.createBooking({
      id: generateId(),
      userId: ctx.userId,
      propertyId: input.propertyId,
      serviceId: input.serviceId,
      roomNumber: input.roomNumber,
      checkIn: input.checkIn,
      checkOut: input.checkOut,
      guests: input.guests,
      totalPrice,
      currency: "KSh",
      status: "pending",
      qrCode: generateQRCode(),
      specialRequests: input.specialRequests,
      paymentStatus: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    db.createNotification({
      id: generateId(),
      userId: ctx.userId,
      type: "booking",
      title: "Booking Created",
      message: `Your booking has been created successfully. Booking ID: ${booking.id}`,
      read: false,
      createdAt: new Date(),
    });

    return {
      success: true,
      booking,
    };
  });

function generateId(): string {
  return `booking-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}

function generateQRCode(): string {
  return `AURA-${Date.now()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
}
