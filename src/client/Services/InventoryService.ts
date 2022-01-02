import { KnitClient as Knit } from "@rbxts/knit";
import Store from "../Rodux/ConfigureStore";
const InventoryService = Knit.GetService("InventoryService");

const InventoryClient = {
	FetchInventory: (Inventory: { Assets: string[]; Weapons: string[] }) => {
		print("Dispatching updated inventory to Store.. | Client");
		Store.dispatch({
			type: "updateInventory",
			inventory: { Assets: Inventory.Assets, Weapons: Inventory.Weapons },
		});
	},
	EquipItem: (itemName: string, category: string) => {
		print(`Attempting to equip ${itemName}!`);
		const equippedItems = InventoryService.EquipItem(itemName, category);
		InventoryClient.UpdateEquippedStore(equippedItems);
	},
	UpdateEquippedStore: (equippedItems: { Assets: string; Weapons: string }) => {
		print("Dispatching updated equipped item to Store.. | Client");
		Store.dispatch({
			type: "equipItem",
			equippedItems: equippedItems,
		});
	},
	init: () => {
		const initialInventory = InventoryService.FetchInventory();
		InventoryClient.FetchInventory(initialInventory);
		InventoryService.InventoryChanged.Connect(InventoryClient.FetchInventory);
		InventoryService.EquippedChanged.Connect(InventoryClient.UpdateEquippedStore);
		print("Inventory Service Initialized | Client");
	},
};

export default InventoryClient;
