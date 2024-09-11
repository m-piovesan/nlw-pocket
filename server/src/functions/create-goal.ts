import { db } from "../db";
import { goals } from "../db/schema";

interface CreateGoalRequest {
  title: string;
  desiredWeeklyFrequency: number;
}

export async function createGoal({
  desiredWeeklyFrequency,
  title,
}: CreateGoalRequest) {
  const result = await db
    .insert(goals)
    .values({ title, desiredWeeklyFrequency })
    .returning();

  const goal = result[0];

  // returning an object with the goal, because if we need to return more than one thing in the future, we can just add it to the object
  return {
    goal,
  };
}
