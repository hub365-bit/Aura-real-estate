import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";

export const createContext = async (opts: FetchCreateContextFnOptions) => {
  const authHeader = opts.req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  let userId: string | null = null;
  let userRole: "user" | "agent" | "landlord" | "service_provider" | "admin" | null = null;

  if (token) {
    try {
      const decoded = await verifyToken(token);
      userId = decoded.userId;
      userRole = decoded.role as "user" | "agent" | "landlord" | "service_provider" | "admin";
    } catch (error) {
      console.error("Invalid token", error);
    }
  }

  return {
    req: opts.req,
    userId,
    userRole,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async (opts) => {
  if (!opts.ctx.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return opts.next({
    ctx: {
      ...opts.ctx,
      userId: opts.ctx.userId,
    },
  });
});

export const adminProcedure = protectedProcedure.use(async (opts) => {
  if (opts.ctx.userRole !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return opts.next(opts);
});

async function verifyToken(token: string): Promise<{ userId: string; role: string }> {
  return { userId: "mock-user-id", role: "user" };
}
