import { and, count, gte, lte } from "drizzle-orm";
import { db } from "../db";
import { goalCompletions } from "../db/schema";
import dayjs from "dayjs";

interface CreateGoalCompletionRequest {
  goalId: string;
}

// This function is responsible for creating a goal completion in the database and returning the created goal completion
export async function createGoal({ goalId }: CreateGoalCompletionRequest) {
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
          gte(goalCompletions.createdAt, firstDayOfTheWeek)
        )
      )
      .groupBy(goalCompletions.goalId)
  );

  const result = await db
    .insert(goalCompletions)
    .values({ goalId })
    .returning();

  const goalCompletion = result[0];

  return {
    goalCompletion,
  };
}
