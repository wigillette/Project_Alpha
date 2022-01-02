import Rodux from "@rbxts/rodux";

interface inventoryState {
	Assets: string[];
	Weapons: string[];
}

interface Action {
	type: string;
	payload?: { Assets: string[]; Weapons: string[] };
}

const inventoryReducer = Rodux.createReducer(
	{ Assets: [] as string[], Weapons: [] as string[] },
	{
		updateInventory: (state: inventoryState, action: Action) => {
			let newState: inventoryState = { Assets: [] as string[], Weapons: [] as string[] };
			if (action.payload) {
				newState = {
					Assets: action.payload.Assets,
					Weapons: action.payload.Weapons,
				};
			}

			print("Inventory Store Update Successful | Client");
			print(newState);
			return newState;
		},
	},
);

export default inventoryReducer;
