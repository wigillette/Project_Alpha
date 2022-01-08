import GoldService from "./GoldService";
import InventoryService from "./InventoryService";
import ShopItems from "../../shared/ShopItems";
import { KnitServer as Knit, RemoteSignal } from "@rbxts/knit";
import ChatService from "./ChatService";

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
						ChatService.PostFeedback(
							Player,
							`You have successfully purchased a ${ItemName}!`,
							Color3.fromRGB(0, 180, 0),
						);
					} else {
						response = "Insufficient Gold";
						ChatService.PostFeedback(
							Player,
							`You do not have enough gold to purchase ${ItemName}!`,
							Color3.fromRGB(180, 0, 0),
						);
					}
				} else {
					response = "Owned";
					ChatService.PostFeedback(Player, `You already own a ${ItemName}!`, Color3.fromRGB(180, 0, 0));
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
