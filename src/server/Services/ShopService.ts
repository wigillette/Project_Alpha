import GoldService from "./GoldService";
import InventoryService from "./InventoryService";
import ShopItems from "../../shared/ShopItems";
import { KnitServer as Knit, RemoteSignal } from "@rbxts/knit";

declare global {
	interface KnitServices {
		ShopService: typeof ShopService;
	}
}

const ShopService = Knit.CreateService({
	Name: "ShopService",

	Client: {
		FetchItems: new RemoteSignal<(ShopItems: {}) => void>(),

		PurchaseItem(Player: Player, ItemName: string, Category: string) {
			return this.Server.PurchaseItem(Player, ItemName, Category);
		},
	},

	PurchaseItem(Player: Player, ItemName: string, Category: string) {
		let response = "D.N.E.";
		if (ItemName in ShopItems) {
			const itemInfo = ShopItems[ItemName as keyof typeof ShopItems];

			if (itemInfo !== undefined) {
				if (!InventoryService.ContainsItem(Player, ItemName, Category)) {
					const gold = GoldService.GetGold(Player);
					if (gold >= itemInfo.Price) {
						GoldService.AddGold(Player, -itemInfo.Price); // Deduct the amount
						InventoryService.AddToInventory(Player, ItemName, Category);
						print(`${Player.Name} bought a ${ItemName} for ${itemInfo.Price}! | Server`);
						response = "Purchased";
					} else {
						response = "Insufficient Gold";
					}
				} else {
					response = "Owned";
				}
			}
		}
		return response;
	},

	FetchItems(Player: Player) {
		this.Client.FetchItems.Fire(Player, ShopItems);
	},

	InitData(Player: Player) {
		this.Client.FetchItems.Fire(Player, ShopItems);
	},

	KnitInit() {
		print("Shop Service Initialized | Server");
	},
});

export default ShopService;
