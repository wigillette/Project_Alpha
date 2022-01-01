import Rodux from "@rbxts/rodux";

interface shopState {
	open: boolean;
}

interface Action<S = string, T = {}> {
	type: string;
}

const shopReducer = Rodux.createReducer(
	{ open: false },
	{
		toggleShop: (state: shopState, action: Action<string>) => {
			const newState: shopState = { open: !state.open };
			return newState;
		},
	},
);

export default shopReducer;
