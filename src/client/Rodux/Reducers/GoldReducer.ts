import Rodux from "@rbxts/rodux";

interface goldState {
	Gold: number;
}

interface Action {
	type: string;
	payload?: { Gold: number };
}

const goldReducer = Rodux.createReducer(
	{ Gold: 0 },
	{
		updateGold: (state: goldState, action: Action) => {
			let newState: goldState = { Gold: 0 };
			if (action.payload) {
				newState = {
					Gold: action.payload.Gold,
				};
			}
			print("Fetched Gold Store Update Successful | Client");
			print(newState);
			return newState;
		},
	},
);

export default goldReducer;
