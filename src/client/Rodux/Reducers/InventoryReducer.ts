import Rodux from "@rbxts/rodux";

interface inventoryState {
	toggle: boolean;
	inventory: {
		Assets: string[];
		Weapons: string[];
	};
	currentTab: string;
	equippedItems: { Weapon: string; Asset: string };
}

interface Action {
	type: string;
	inventory?: { Assets: string[]; Weapons: string[] };
	tab?: string;
	equippedItems?: { Weapon: string; Asset: string };
}

const inventoryReducer = Rodux.createReducer(
	{
		toggle: false,
		inventory: { Assets: [] as string[], Weapons: [] as string[] },
		currentTab: "Assets",
		equippedItems: { Weapon: "", Asset: "" },
	},
	{
		updateInventory: (state: inventoryState, action: Action) => {
			let newState: inventoryState = {
				toggle: state.toggle,
				inventory: { Assets: [] as string[], Weapons: [] as string[] },
				currentTab: state.currentTab,
				equippedItems: state.equippedItems,
			};
			if (action.inventory) {
				newState = {
					toggle: state.toggle,
					inventory: {
						Assets: action.inventory.Assets,
						Weapons: action.inventory.Weapons,
					},
					currentTab: state.currentTab,
					equippedItems: state.equippedItems,
				};
			}

			print("Inventory Store Items Update Successful | Client");
			return newState;
		},
		toggleInventory: (state: inventoryState, action: Action) => {
			const newState: inventoryState = {
				toggle: !state.toggle,
				inventory: {
					Assets: state.inventory.Assets,
					Weapons: state.inventory.Weapons,
				},
				currentTab: state.currentTab,
				equippedItems: state.equippedItems,
			};

			return newState;
		},
		changeTab: (state: inventoryState, action: Action) => {
			let newState: inventoryState = {
				toggle: state.toggle,
				inventory: {
					Assets: state.inventory.Assets,
					Weapons: state.inventory.Weapons,
				},
				currentTab: state.currentTab,
				equippedItems: state.equippedItems,
			};

			if (action.tab !== undefined) {
				newState = {
					toggle: state.toggle,
					inventory: {
						Assets: state.inventory.Assets,
						Weapons: state.inventory.Weapons,
					},
					currentTab: action.tab,
					equippedItems: state.equippedItems,
				};
			}

			return newState;
		},
		equipItem: (state: inventoryState, action: Action) => {
			let newState: inventoryState = {
				toggle: state.toggle,
				inventory: {
					Assets: state.inventory.Assets,
					Weapons: state.inventory.Weapons,
				},
				currentTab: state.currentTab,
				equippedItems: state.equippedItems,
			};

			if (action.equippedItems !== undefined) {
				newState = {
					toggle: state.toggle,
					inventory: {
						Assets: state.inventory.Assets,
						Weapons: state.inventory.Weapons,
					},
					currentTab: state.currentTab,
					equippedItems: action.equippedItems,
				};
			}

			print("Inventory Store Equipped Update Successful | Client");
			return newState;
		},
	},
);

export default inventoryReducer;
