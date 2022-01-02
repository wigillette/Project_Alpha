import Rodux from "@rbxts/rodux";

interface shopState {
	open: boolean;
	items: {};
}

interface Action {
	type: string;
	payload?: { ShopItems: Map<string, { Price: number }> };
}

const shopReducer = Rodux.createReducer(
	{ open: false, items: {} },
	{
		toggleShop: (state: shopState, action: Action) => {
			const newState: shopState = { open: !state.open, items: state.items };
			return newState;
		},
		fetchItems: (state: shopState, action: Action) => {
			let newState: shopState = { open: state.open, items: state.items };
			if (action.payload) {
				newState = { open: state.open, items: action.payload.ShopItems };
			}
			print("Fetched Items Store Update Successful | Client");
			return newState;
		},
	},
);

export default shopReducer;
