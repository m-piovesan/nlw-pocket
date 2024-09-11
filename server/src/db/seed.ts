import { client, db } from ".";
import { goalCompletions, goals } from "./schema";
import dayjs from "dayjs";

async function seed() {
  await db.delete(goalCompletions);
  await db.delete(goals);

  const result = await db
    .insert(goals)
    .values([
      { title: "Acordar cedo", desiredWeeklyFrequency: 5 },
      { title: "Me exercitar", desiredWeeklyFrequency: 3 },
      { title: "Meditar", desiredWeeklyFrequency: 1 },
    ])
    .returning(); // returning() is a helper function that returns the inserted rows, so that we can use them in whatever way we want

  const startOfWeek = dayjs().startOf("week");

  // using result[0].id and result[1].id to get the ids of the inserted goals, as we exported them using returning() at line 16
  await db.insert(goalCompletions).values([
    { goalId: result[0].id, createdAt: startOfWeek.toDate() },
    { goalId: result[1].id, createdAt: startOfWeek.add(1, "day").toDate() },
  ]);
}

// using finally to ensure that the client is closed after the seed function is done, regardless of the outcome
seed().finally(() => {
  client.end();
});
