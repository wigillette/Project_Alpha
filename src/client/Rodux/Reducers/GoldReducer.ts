import Rodux from "@rbxts/rodux";

interface goldState {
	Gold: number;
}

interface Action<S = string, T = {}> {
	type: string;
	payload?: { Gold: number };
}

const profileReducer = Rodux.createReducer(
	{ Gold: 0 },
	{
		updateGold: (state: goldState, action: Action<string, {}>) => {
			let newState: goldState = { Gold: 0 };
			if (action.payload) {
				newState = {
					Gold: action.payload.Gold,
				};
			}

			print(newState);
			return newState;
		},
	},
);

export default profileReducer;
