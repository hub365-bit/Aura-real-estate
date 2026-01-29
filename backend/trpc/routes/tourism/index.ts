import { z } from 'zod';
import { publicProcedure, router } from '../../create-context';

export const tourismRouter = router({
  getTourGuides: publicProcedure
    .input(z.object({
      location: z.string().optional(),
      type: z.enum(['safari', 'city', 'cultural', 'food', 'hiking', 'nightlife', 'multi_day']).optional(),
      languages: z.array(z.string()).optional(),
    }))
    .query(async ({ input }) => {
      return {
        guides: [],
        total: 0,
      };
    }),

  getTourGuide: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return null;
    }),

  getExperiences: publicProcedure
    .input(z.object({
      location: z.string().optional(),
      type: z.enum(['safari', 'city', 'cultural', 'food', 'hiking', 'nightlife', 'multi_day']).optional(),
      minPrice: z.number().optional(),
      maxPrice: z.number().optional(),
    }))
    .query(async ({ input }) => {
      return {
        experiences: [],
        total: 0,
      };
    }),

  getExperience: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return null;
    }),

  getTransport: publicProcedure
    .input(z.object({
      type: z.enum(['airport_pickup', 'car_hire', 'tour_van', 'boda', 'tuk_tuk']).optional(),
      location: z.string().optional(),
    }))
    .query(async ({ input }) => {
      return {
        transports: [],
        total: 0,
      };
    }),

  getItineraries: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      return {
        itineraries: [],
        total: 0,
      };
    }),

  getItinerary: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return null;
    }),

  createItinerary: publicProcedure
    .input(z.object({
      title: z.string(),
      destination: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      currency: z.string(),
      totalBudget: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      return { id: 'new-itinerary-id' };
    }),

  addItineraryItem: publicProcedure
    .input(z.object({
      itineraryId: z.string(),
      type: z.enum(['hotel', 'experience', 'transport', 'restaurant', 'custom']),
      title: z.string(),
      description: z.string().optional(),
      date: z.string(),
      startTime: z.string(),
      endTime: z.string(),
      location: z.object({
        name: z.string(),
        address: z.string(),
        lat: z.number(),
        lng: z.number(),
      }),
      cost: z.number().optional(),
      currency: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return { id: 'new-item-id' };
    }),

  getCulturalInfo: publicProcedure
    .input(z.object({
      location: z.string(),
      country: z.string(),
    }))
    .query(async ({ input }) => {
      return null;
    }),

  bookTransport: publicProcedure
    .input(z.object({
      transportId: z.string(),
      pickupLocation: z.string(),
      dropoffLocation: z.string(),
      pickupTime: z.string(),
      passengers: z.number(),
      luggage: z.number(),
    }))
    .mutation(async ({ input }) => {
      return { bookingId: 'new-booking-id' };
    }),

  bookExperience: publicProcedure
    .input(z.object({
      experienceId: z.string(),
      date: z.string(),
      participants: z.number(),
      bookingOption: z.enum(['private', 'group', 'custom']),
      specialRequests: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return { bookingId: 'new-booking-id' };
    }),
});
