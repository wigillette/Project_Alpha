import { KnitClient as Knit } from "@rbxts/knit";
import Store from "../Rodux/ConfigureStore";
const ShopService = Knit.GetService("ShopService");

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
		const resp = ShopService.PurchaseItem(name, category);
		Store.dispatch({
			type: "purchaseItem",
			response: {
				itemName: name,
				feedback: resp,
			},
		});
	},
	init: () => {
		ShopService.FetchItems.Connect(ShopClient.FetchItems);
		print("Shop Service Initialized | Client");
	},
};

export default ShopClient;
