import { Button } from "./ui/button";
import { DialogTrigger } from "./ui/dialog";
import { LogoIcon } from "./in-orbit-logo-icon";

export function Summary() {
	return (
		<div className="py-10 max-w-[480px] px-5 mx-auto flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<div className="flex itens-center gap-3">
					<LogoIcon />
					<span className="text-lg font-semibold">05 a 12 de agosto</span>
				</div>

				<DialogTrigger asChild>
					<Button size="sm">Cadastar meta</Button>
				</DialogTrigger>
			</div>
		</div>
	);
}
