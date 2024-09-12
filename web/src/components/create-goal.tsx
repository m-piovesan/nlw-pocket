import { X } from "lucide-react";
import {
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
	RadioGroup,
	RadioGroupIndicator,
	RadioGroupItem,
} from "./ui/radio-group";

export function CreateGoal() {
	return (
		<DialogContent>
			<div className="flex flex-col gap-6 h-full">
				<div className="flex flex-col gap-3">
					<div className="flex itens-center justify-between">
						<DialogTitle>Cadastrar meta</DialogTitle>

						<DialogClose>
							<X className="size-5 text-zinc-600" />
						</DialogClose>
					</div>

					<DialogDescription>
						Adicione atividades que te fazem bem e que você quer continuar
						praticando toda semana.
					</DialogDescription>
				</div>

				<form className="flex flex-col justify-between flex-1">
					<div className="flex flex-col gap-6">
						<div className="flex flex-col gap-2">
							<Label htmlFor="title">Qual a atividade?</Label>
							<Input
								placeholder="Praticar exercícios, meditar, etc..."
								autoFocus
								id="title"
							/>
						</div>

						<div className="flex flex-col gap-2">
							<Label htmlFor="title">Quantas vezes na semana?</Label>
							<RadioGroup>
								<RadioGroupItem value="1">
									<RadioGroupIndicator />
									<span className="text-zinc-300 text-sm font-medium leading-none">
										1x na semana
									</span>

									<span className="text-lg leading-none">🥱</span>
								</RadioGroupItem>

								<RadioGroupItem value="2">
									<RadioGroupIndicator />
									<span className="text-zinc-300 text-sm font-medium leading-none">
										2x na semana
									</span>

									<span className="text-lg leading-none">🙂</span>
								</RadioGroupItem>

								<RadioGroupItem value="3">
									<RadioGroupIndicator />

									<span className="text-zinc-300 text-sm font-medium leading-none">
										3x na semana
									</span>
									<span className="text-lg leading-none">😎</span>
								</RadioGroupItem>

								<RadioGroupItem value="4">
									<RadioGroupIndicator />

									<span className="text-zinc-300 text-sm font-medium leading-none">
										4x na semana
									</span>
									<span className="text-lg leading-none">😜</span>
								</RadioGroupItem>

								<RadioGroupItem value="5">
									<RadioGroupIndicator />

									<span className="text-zinc-300 text-sm font-medium leading-none">
										5x na semana
									</span>
									<span className="text-lg leading-none">🤨</span>
								</RadioGroupItem>

								<RadioGroupItem value="6">
									<RadioGroupIndicator />

									<span className="text-zinc-300 text-sm font-medium leading-none">
										6x na semana
									</span>
									<span className="text-lg leading-none">🤯</span>
								</RadioGroupItem>

								<RadioGroupItem value="7">
									<RadioGroupIndicator />

									<span className="text-zinc-300 text-sm font-medium leading-none">
										7x na semana
									</span>
									<span className="text-lg leading-none">🔥</span>
								</RadioGroupItem>
							</RadioGroup>
						</div>
					</div>

					<div className="flex itens-center gap-3">
						<DialogClose asChild>
							<Button variant="secondary" className="flex-1">
								Fechar
							</Button>
						</DialogClose>

						<Button className="flex-1">Salvar</Button>
					</div>
				</form>
			</div>
		</DialogContent>
	);
}
