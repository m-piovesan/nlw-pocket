type SummaryResponse = {
  completed: number;
  total: number;
  goalsPerDay: Record<
    string,
    {
      id: number;
      title: string;
      completedAt: Date;
    }[]
  >;
};

export async function getSummary(): Promise<SummaryResponse> {
  const response = await fetch("http://localhost:3333/summary");
  const data = await response.json();

  return data.summary;
}
