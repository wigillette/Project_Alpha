import { CoreHooks } from "@rbxts/roact-hooks";

export function useMountEffect(callback: Callback, { useEffect }: CoreHooks) {
	useEffect(callback, []);
}
