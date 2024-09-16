import { Button } from "./ui/button";
import { DialogTrigger } from "./ui/dialog";
import { LogoIcon } from "./in-orbit-logo-icon";
import { Progress, ProgressIndicator } from "./ui/progress-bar";
import { Separator } from "./ui/separator";
import { CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getSummary } from "../http/getSummary";
import dayjs from "dayjs";
import ptBR from "dayjs/locale/pt-br";
import { PendingGoals } from "./pending-goals";

dayjs.locale(ptBR);

export function Summary() {
	const { data } = useQuery({
		queryKey: ["summary"],
		queryFn: getSummary,
		staleTime: 1000 * 60,
	});

	const firstDayOfWeek = dayjs().startOf("week").format("D MMM");
	const lastDayOfWeek = dayjs().endOf("week").format("D MMM");

	console.log(data);

	if (!data) return null;

	const completePercentage = Math.round((data.completed * 100) / data.total);

	return (
		<div className="py-10 max-w-[480px] px-5 mx-auto flex flex-col gap-6">
			<div className="flex itens-center justify-between">
				<div className="flex itens-center gap-3">
					<LogoIcon />
					<span className="text-lg font-semibold capitalize">
						{firstDayOfWeek} - {lastDayOfWeek}
					</span>
				</div>

				<DialogTrigger asChild>
					<Button size="sm">Cadastar meta</Button>
				</DialogTrigger>
			</div>

			{/* showing the progress bar */}
			<div className="flex flex-col gap-3">
				<Progress value={8} max={15}>
					<ProgressIndicator style={{ width: `${completePercentage}%` }} />
				</Progress>

				<div className="flex itens-center justify-between text-xs text-zinc-400">
					<span>
						Você completou{" "}
						<span className="text-zinc-100">{data?.completed}</span> de{" "}
						<span className="text-zinc-100">{data?.total}</span> metas essa
						semana.
					</span>
					<span>{completePercentage}%</span>
				</div>
			</div>

			<Separator />

			<PendingGoals />

			{/* showing the goals that were completed by day */}
			<div className="flex flex-col gap-6">
				<h2 className="text-xl font-medium">Sua semana:</h2>

				{data?.goalsPerDay && Object.keys(data.goalsPerDay).length > 0 ? (
					Object.entries(data.goalsPerDay).map(([date, goals]) => {
						const weekDay = dayjs(date).format("dddd");
						const formattedDate = dayjs(date).format("D [de] MMMM");

						return (
							<div key={date} className="flex flex-col gap-4">
								<h3 className="font-medium">
									<span className="capitalize">{weekDay} </span>
									<span className="text-zinc-400 text-xs">
										({formattedDate})
									</span>
								</h3>

								<ul className="flex flex-col gap-3">
									{goals.map((goal) => {
										const time = dayjs(goal.completedAt).format("HH:mm");

										return (
											<li key={goal.id} className="flex items-center gap-2">
												<CheckCircle className="size-4 text-zinc-400" />

												<span className="text-sm text-zinc-400">
													Você completou "{}
													<span className="text-zinc-100">{goal.title}</span>"
													às <span className="text-zinc-100">{time}</span>
												</span>
											</li>
										);
									})}
								</ul>
							</div>
						);
					})
				) : (
					<p>Nenhuma meta completada nesta semana.</p>
				)}
			</div>
		</div>
	);
}
