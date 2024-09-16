import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

interface OutlineButtonProps extends ComponentProps<"button"> {
	isDelete?: boolean; // Torna isDelete opcional com o valor padrão definido abaixo
}

export function OutlineButton({
	isDelete = false, // Valor padrão de isDelete
	...props
}: Readonly<OutlineButtonProps>) {
	return (
		<button
			{...props}
			className={twMerge(
				"flex items-center px-3 py-2 gap-2 leading-none rounded-full border border-dashed text-sm text-zinc-300 disabled:opacity-50 disabled:pointer-events-none outline-none focus-visible:border-pink-500 ring-pink-500/10 focus-visible:ring-4",
				isDelete
					? "border-green-800 hover:border-green-700"
					: "border-zinc-800 hover:border-zinc-700",
				props.className,
			)}
		/>
	);
}
