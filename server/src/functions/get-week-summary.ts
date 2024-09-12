import { and, eq, gte, lte, sql } from "drizzle-orm";
import { db } from "../db";
import { goalCompletions, goals } from "../db/schema";
import dayjs from "dayjs";

export async function getWeekSummary() {
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

  // Get all goals completed this week
  const goalsCompletedThisWeek = db.$with("goals_completed_this_week").as(
    db
      .select({
        id: goalCompletions.id,
        title: goals.title,
        completedAt: goalCompletions.createdAt,
        completedDate: sql`
            DATE(${goalCompletions.createdAt})
        `.as("completedDate"),
      })
      .from(goalCompletions)
      .innerJoin(goals, eq(goals.id, goalCompletions.goalId))
      .where(
        and(
          lte(goalCompletions.createdAt, lastDayOfTheWeek),
          gte(goalCompletions.createdAt, firstDayOfTheWeek)
        )
      )
  );

  // Group the goals completed this week by day of the week
  const goalsCompletedByWeekDay = db.$with("goals_completed_by_week_day").as(
    db
      .select({
        completedDate: goalsCompletedThisWeek.completedDate,
        completions: sql`
            JSON_AGG(
                JSON_BUILD_OBJECT(
                    'id', ${goalsCompletedThisWeek.id},
                    'title', ${goalsCompletedThisWeek.title},
                    'completedAt', ${goalsCompletedThisWeek.completedAt}
                )
            )    
        `.as("completions"),
      })
      .from(goalsCompletedThisWeek)
      .groupBy(goalsCompletedThisWeek.completedDate)
  );

  const result = await db
    .with(
      goalsCreatedUpToThisWeek,
      goalsCompletedThisWeek,
      goalsCompletedByWeekDay
    )
    .select({
      completed: sql`
            (SELECT COUNT(*) FROM ${goalsCompletedThisWeek})
        `
        .mapWith(Number)
        .as("completed"),
      total: sql`
            (SELECT SUM(${goalsCreatedUpToThisWeek.desiredWeeklyFrequency}) FROM ${goalsCreatedUpToThisWeek})
        `
        .mapWith(Number)
        .as("total"),
      goalsPerDay: sql`
            JSON_OBJECT_AGG(
                ${goalsCompletedByWeekDay.completedDate},
                ${goalsCompletedByWeekDay.completions}
            )
        `.as("goalsPerDay"),
    })
    .from(goalsCompletedByWeekDay);

  return {
    summary: result,
  };
}
