import { KnitClient as Knit } from "@rbxts/knit";
import Store from "../Rodux/ConfigureStore";
const ShopService = Knit.GetService("ShopService");

const ShopClient = {
	FetchItems: (Items: {}) => {
		// TO-DO: Dispatch fetched items to Rodux store
		print(`Fetching items on client`);
		print(Items);
		Store.dispatch({
			type: "fetchItems",
			payload: { ShopItems: Items },
		});
	},
	init: () => {
		ShopService.FetchItems.Connect(ShopClient.FetchItems);
		print("Shop Service Initialized | Client");
	},
};

export default ShopClient;
