import { publicProcedure } from "../../create-context";
import { z } from "zod";

export const createEventProcedure = publicProcedure
  .input(z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['conference', 'training', 'religious', 'social', 'other']),
    location: z.object({
      name: z.string(),
      address: z.string(),
      city: z.string(),
      lat: z.number(),
      lng: z.number(),
    }),
    startDate: z.string(),
    endDate: z.string(),
    price: z.number(),
    currency: z.string().default('KES'),
    capacity: z.number().positive(),
    images: z.array(z.string()),
    organizerId: z.string(),
  }))
  .mutation(async ({ input, ctx }) => {
    const eventId = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    console.log(`[Event] Created: ${eventId}`, { title: input.title });

    return {
      id: eventId,
      ...input,
      booked: 0,
      status: 'upcoming' as const,
      createdAt: new Date().toISOString(),
    };
  });
