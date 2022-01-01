import Rodux from "@rbxts/rodux";

interface shopState {
	open: boolean;
	items: {};
}

interface Action<S = string, T = {}> {
	type: string;
	payload?: { ShopItems: {} };
}

const shopReducer = Rodux.createReducer(
	{ open: false, items: {} },
	{
		toggleShop: (state: shopState, action: Action<string, {}>) => {
			const newState: shopState = { open: !state.open, items: state.items };
			return newState;
		},
		fetchItems: (state: shopState, action: Action<string, {}>) => {
			let newState: shopState = { open: state.open, items: state.items };
			if (action.payload) {
				newState = { open: state.open, items: action.payload.ShopItems };
			}
			return newState;
		},
	},
);

export default shopReducer;
