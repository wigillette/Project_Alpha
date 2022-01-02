import { KnitClient as Knit } from "@rbxts/knit";
import Store from "../Rodux/ConfigureStore";
const InventoryService = Knit.GetService("InventoryService");

const InventoryClient = {
	FetchInventory: (Inventory: { Assets: string[]; Weapons: string[] }) => {
		print("Dispatching updated inventory to Store.. | Client");
		Store.dispatch({
			type: "updateInventory",
			payload: { Assets: Inventory.Assets, Weapons: Inventory.Weapons },
		});
	},
	init: () => {
		const initialInventory = InventoryService.FetchInventory();
		InventoryClient.FetchInventory(initialInventory);
		InventoryService.InventoryChanged.Connect(InventoryClient.FetchInventory);
		print("Inventory Service Initialized | Client");
	},
};

export default InventoryClient;
