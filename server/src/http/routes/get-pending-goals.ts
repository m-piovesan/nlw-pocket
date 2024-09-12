import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { getWeekPendingGoals } from "../../functions/get-week-pending-goals";

// returns the pending goals for the week
export const getPendindGoalsRoute: FastifyPluginAsyncZod = async (app) => {
  app.get("/pending-goals", async () => {
    const { pendingGoals } = await getWeekPendingGoals();

    return {
      pendingGoals,
    };
  });
};
