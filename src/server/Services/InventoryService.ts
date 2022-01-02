import { KnitServer as Knit, Signal, RemoteSignal } from "@rbxts/knit";
import { Players } from "@rbxts/services";

declare global {
	interface KnitServices {
		InventoryService: typeof InventoryService;
	}
}

interface InventoryFormat {
	Weapons: string[];
	Assets: string[];
}

const InventoryService = Knit.CreateService({
	Name: "InventoryService",
	PlayerInventories: new Map<Player, InventoryFormat>(),

	Client: {
		InventoryChanged: new RemoteSignal<(Inventory: InventoryFormat) => void>(),
		FetchInventory(Player: Player) {
			return this.Server.FetchInventory(Player);
		},
	},

	AddToInventory(Player: Player, ItemName: string, Category: string) {
		const playerInventory = this.FetchInventory(Player);
		playerInventory[Category as keyof typeof playerInventory].push(ItemName);
		this.Client.InventoryChanged.Fire(Player, playerInventory);
	},

	ContainsItem(Player: Player, ItemName: string, Category: string) {
		const playerInventory = this.FetchInventory(Player);
		const itemList = playerInventory[Category as keyof typeof playerInventory];
		return itemList.includes(ItemName);
	},

	FetchInventory(Player: Player) {
		const playerInventory = (this.PlayerInventories.get(Player) as InventoryFormat) || {
			Weapons: [] as string[],
			Assets: [] as string[],
		};
		return playerInventory;
	},

	KnitInit() {
		print("Inventory Service Initialized | Server");
		Players.PlayerAdded.Connect((player) => {
			this.FetchInventory(player);
		});
	},
});

export default InventoryService;
