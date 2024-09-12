import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { getWeekSummary } from "../../functions/get-week-summary";

// returns the pending goals for the week
export const getWeekSummaryRoute: FastifyPluginAsyncZod = async (app) => {
  app.get("/summary", async () => {
    const { summary } = await getWeekSummary();

    return { summary };
  });
};
