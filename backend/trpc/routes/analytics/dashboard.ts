import { z } from "zod";
import { protectedProcedure } from "../../create-context";
import { db } from "../../../db/mock-db";

export const getAnalyticsDashboardProcedure = protectedProcedure
  .input(
    z.object({
      startDate: z.date().optional(),
      endDate: z.date().optional(),
    })
  )
  .query(async ({ ctx, input }) => {
    const startDate = input.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = input.endDate || new Date();

    const properties = db.getProperties({ userId: ctx.userId });
    const bookings = db.getBookings(ctx.userId);
    const tickets = db.getTickets({ userId: ctx.userId });

    const totalViews = properties.reduce((sum, p) => sum + p.views, 0);
    const totalSaves = properties.reduce((sum, p) => sum + p.saves, 0);
    const totalLeads = properties.reduce((sum, p) => sum + p.leads, 0);

    const completedBookings = bookings.filter(
      b => b.status === "checked_out" && b.createdAt >= startDate && b.createdAt <= endDate
    ).length;

    const totalRevenue = bookings
      .filter(b => b.paymentStatus === "completed" && b.createdAt >= startDate && b.createdAt <= endDate)
      .reduce((sum, b) => sum + b.totalPrice, 0);

    const openTickets = tickets.filter(t => t.status === "open").length;

    const chartData = generateChartData(startDate, endDate);

    return {
      overview: {
        totalProperties: properties.length,
        totalViews,
        totalSaves,
        totalLeads,
        completedBookings,
        totalRevenue,
        openTickets,
      },
      chartData,
      properties: properties.slice(0, 5),
    };
  });

function generateChartData(startDate: Date, endDate: Date) {
  const data = [];
  const daysDiff = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const points = Math.min(daysDiff, 30);

  for (let i = 0; i < points; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      views: Math.floor(Math.random() * 100) + 20,
      bookings: Math.floor(Math.random() * 10),
      revenue: Math.floor(Math.random() * 50000) + 10000,
    });
  }

  return data;
}
