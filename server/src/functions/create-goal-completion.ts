import { and, count, eq, gte, lte, sql } from "drizzle-orm";
import { db } from "../db";
import { goalCompletions, goals } from "../db/schema";
import dayjs from "dayjs";

interface CreateGoalCompletionRequest {
  goalId: string;
}

// This function is responsible for creating a goal completion in the database and returning the created goal completion
export async function createGoalCompletion({
  goalId,
}: CreateGoalCompletionRequest) {
  const firstDayOfTheWeek = dayjs().startOf("week").toDate();
  const lastDayOfTheWeek = dayjs().endOf("week").toDate();

  const goalsCompletionCount = db.$with("goals_completion_count").as(
    db
      .select({
        goalId: goalCompletions.goalId,
        completionCount: count(goalCompletions.id).as("completionCount"),
      })
      .from(goalCompletions)
      .where(
        and(
          lte(goalCompletions.createdAt, lastDayOfTheWeek),
          gte(goalCompletions.createdAt, firstDayOfTheWeek),
          eq(goalCompletions.goalId, goalId)
        )
      )
      .groupBy(goalCompletions.goalId)
  );

  const result = await db
    .with(goalsCompletionCount)
    .select({
      desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
      completionCount:
        sql`COALESCE(${goalsCompletionCount.completionCount}, 0)`.mapWith(
          Number
        ),
    })
    .from(goals)
    .leftJoin(goalsCompletionCount, eq(goalsCompletionCount.goalId, goals.id))
    .where(eq(goals.id, goalId))
    .limit(1);

  const { completionCount, desiredWeeklyFrequency } = result[0];

  if (completionCount >= desiredWeeklyFrequency) {
    throw new Error("Goal already completed for the week");
  }

  const insertResult = await db
    .insert(goalCompletions)
    .values({ goalId })
    .returning();

  const goalCompletion = insertResult[0];

  return {
    goalCompletion,
  };
}
