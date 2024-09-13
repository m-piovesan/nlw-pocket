import dayjs from "dayjs";
import { db } from "../db";
import { goalCompletions, goals } from "../db/schema";
import { lte, count, and, gte, eq, sql } from "drizzle-orm";

export async function getWeekPendingGoals() {
  const firstDayOfTheWeek = dayjs().startOf("week").toDate();
  const lastDayOfTheWeek = dayjs().endOf("week").toDate();

  // Get all goals created up to this week
  const goalsCreatedUpToThisWeek = db.$with("goals_created_up_to_this_week").as(
    db
      .select({
        id: goals.id,
        title: goals.title,
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
        createdAt: goals.createdAt,
      })
      .from(goals)
      .where(lte(goals.createdAt, lastDayOfTheWeek))
  );

  // Get the completion count for each goal for this week
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

  // Get the pending goals for this week by joining the goals created up to this week with the completion count
  const pendingGoals = await db
    .with(goalsCreatedUpToThisWeek, goalsCompletionCount)
    .select({
      id: goalsCreatedUpToThisWeek.id,
      title: goalsCreatedUpToThisWeek.title,
      desiredWeeklyFrequency: goalsCreatedUpToThisWeek.desiredWeeklyFrequency,
      completionCount:
        sql`COALESCE(${goalsCompletionCount.completionCount}, 0)`.mapWith(
          Number
        ),
    })
    .from(goalsCreatedUpToThisWeek)
    .leftJoin(
      goalsCompletionCount,
      eq(goalsCompletionCount.goalId, goalsCreatedUpToThisWeek.id)
    );

  return { pendingGoals };
}
