import Rodux from "@rbxts/rodux";

interface shopState {
	open: boolean;
	items: {};
	response: { itemName: string; feedback: string };
}

interface Action {
	type: string;
	payload?: { ShopItems: Map<string, { Price: number }> };
	response?: { itemName: string; feedback: string };
}

const shopReducer = Rodux.createReducer(
	{ open: false, items: {}, response: { itemName: "", feedback: "" } },
	{
		toggleShop: (state: shopState, action: Action) => {
			const newState: shopState = { open: !state.open, items: state.items, response: state.response };
			return newState;
		},
		fetchItems: (state: shopState, action: Action) => {
			let newState: shopState = { open: state.open, items: state.items, response: state.response };
			if (action.payload) {
				newState = { open: state.open, items: action.payload.ShopItems, response: state.response };
			}
			print("Fetched Items Store Update Successful | Client");
			return newState;
		},
		purchaseItem: (state: shopState, action: Action) => {
			let newState: shopState = { open: state.open, items: state.items, response: state.response };
			if (action.response !== undefined) {
				newState = { open: state.open, items: state.items, response: action.response };
			}
			print("Updated Purchase Feedback | Client");
			return newState;
		},
	},
);

export default shopReducer;
