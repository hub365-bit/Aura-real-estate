import { z } from "zod";
import { publicProcedure } from "../../create-context";
import { Event } from "../../../db/schema";

export const listEventsProcedure = publicProcedure
  .input(
    z.object({
      status: z.string().optional(),
      type: z.string().optional(),
    })
  )
  .query(async ({ input }): Promise<Event[]> => {
    console.log("🎟️ Fetching events:", input);

    const mockEvents: Event[] = [
      {
        id: "event_1",
        organizerId: "organizer_123",
        type: "conference",
        title: "Tech Summit Kenya 2026",
        description: "Annual technology conference bringing together innovators",
        startDate: new Date("2026-03-15T09:00:00"),
        endDate: new Date("2026-03-15T18:00:00"),
        location: {
          address: "KICC, Nairobi",
          lat: -1.2921,
          lng: 36.8219,
        },
        capacity: 500,
        ticketPrice: 2500,
        currency: "KES",
        images: ["https://picsum.photos/800/600?random=1"],
        ticketsSold: 234,
        status: "published",
        createdAt: new Date(Date.now() - 86400000 * 20),
      },
    ];

    return mockEvents;
  });
