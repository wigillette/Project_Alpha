import GoldService from "./GoldService";
import ShopItems from "../../shared/ShopItems";
import { KnitServer as Knit } from "@rbxts/knit";
import { Players } from "@rbxts/services";

declare global {
	interface KnitServices {
		ShopService: typeof ShopService;
	}
}

const ShopService = Knit.CreateService({
	Name: "ShopService",

	Client: {
		FetchItems() {
			return this.Server.FetchItems();
		},

		PurchaseItem(Player: Player, ItemName: keyof typeof ShopItems) {
			return this.Server.PurchaseItem(Player, ItemName);
		},
	},

	PurchaseItem(Player: Player, ItemName: keyof typeof ShopItems) {
		const itemInfo = ShopItems[ItemName];

		if (itemInfo) {
			// TO-DO: Check if the user owns the item in the inventory service
			const gold = GoldService.GetGold(Player);
			if (gold >= itemInfo.Price) {
				GoldService.AddGold(Player, -itemInfo.Price); // Deduct the amount
				print(`${Player.Name} bought a ${ItemName} for ${itemInfo.Price}! | Server`);
				// TO-DO: Add the item to the inventory via the inventory service
			}
		}
	},

	FetchItems() {
		return ShopItems;
	},

	KnitInit() {
		print("Gold Service Initialized | Server");
	},
});

export default ShopService;
