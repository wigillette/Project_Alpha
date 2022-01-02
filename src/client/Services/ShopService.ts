import { KnitClient as Knit } from "@rbxts/knit";
import Store from "../Rodux/ConfigureStore";
const ShopService = Knit.GetService("ShopService");
import ShopItems from "../../shared/ShopItems";

const ShopClient = {
	FetchItems: (Items: {}) => {
		print("Dispatching shop items to Store.. | Client");
		Store.dispatch({
			type: "fetchItems",
			payload: { ShopItems: Items },
		});
	},
	PurchaseItem: (name: string, category: string) => {
		print(`Attempting to purchase ${name}!`);
		ShopService.PurchaseItem(name, category);
	},
	init: () => {
		ShopService.FetchItems.Connect(ShopClient.FetchItems);
		print("Shop Service Initialized | Client");
	},
};

export default ShopClient;
