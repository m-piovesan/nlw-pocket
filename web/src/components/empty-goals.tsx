import logo from "../assets/logo-in-orbit.svg";
import illustration from "../assets/illustration.svg";

import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { CreateGoal } from "./create-goal";

export function EmptyGoals() {
	return (
		<Dialog>
			<div className="h-screen flex flex-col items-center justify-center gap-8">
				<img src={logo} alt="in-orbit logo" />
				<img src={illustration} alt="" />

				<p className="text-zinc-300 leading-relaxed max-w-80 text-center">
					Você ainda não cadastrou nenhuma meta, que tal fazer isso agora mesmo?
				</p>

				<DialogTrigger asChild>
					<Button>
						<Plus className="size-4" />
						Cadastrar meta
					</Button>
				</DialogTrigger>
			</div>

			<CreateGoal />
		</Dialog>
	);
}
