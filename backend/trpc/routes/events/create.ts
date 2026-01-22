import { z } from "zod";
import { publicProcedure } from "../../create-context";
import { Event, eventTypeSchema } from "../../../db/schema";

export const createEventProcedure = publicProcedure
  .input(
    z.object({
      organizerId: z.string(),
      venueId: z.string().optional(),
      type: eventTypeSchema,
      title: z.string(),
      description: z.string(),
      startDate: z.date(),
      endDate: z.date(),
      location: z.object({
        address: z.string(),
        lat: z.number(),
        lng: z.number(),
      }),
      capacity: z.number(),
      ticketPrice: z.number(),
      currency: z.string(),
      images: z.array(z.string()),
    })
  )
  .mutation(async ({ input }): Promise<Event> => {
    console.log("🎟️ Creating event:", input);

    const event: Event = {
      id: `event_${Date.now()}`,
      organizerId: input.organizerId,
      venueId: input.venueId,
      type: input.type,
      title: input.title,
      description: input.description,
      startDate: input.startDate,
      endDate: input.endDate,
      location: input.location,
      capacity: input.capacity,
      ticketPrice: input.ticketPrice,
      currency: input.currency,
      images: input.images,
      ticketsSold: 0,
      status: "draft",
      createdAt: new Date(),
    };

    console.log("✅ Event created successfully");
    return event;
  });
