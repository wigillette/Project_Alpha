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

interface EquippedFormat {
	Weapons: string;
	Assets: string;
}

const InventoryService = Knit.CreateService({
	Name: "InventoryService",
	PlayerInventories: new Map<Player, InventoryFormat>(),
	PlayerEquipped: new Map<Player, EquippedFormat>(),

	Client: {
		InventoryChanged: new RemoteSignal<(Inventory: InventoryFormat) => void>(),
		FetchInventory(Player: Player) {
			return this.Server.FetchInventory(Player);
		},
		EquipItem(Player: Player, ItemName: string, Category: string) {
			return this.Server.EquipItem(Player, ItemName, Category);
		},
	},

	AddToInventory(Player: Player, ItemName: string, Category: string) {
		const playerInventory = this.FetchInventory(Player);
		playerInventory[Category as keyof typeof playerInventory].push(ItemName);
		this.PlayerInventories.set(Player, playerInventory);
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

	FetchEquipped(Player: Player) {
		const equippedItems = this.PlayerEquipped.get(Player) || { Weapons: "", Assets: "" };
		return equippedItems;
	},

	EquipItem(Player: Player, ItemName: string, Category: string) {
		const equippedItems = this.FetchEquipped(Player);
		print(equippedItems);

		equippedItems[Category as keyof typeof equippedItems] = ItemName;
		this.PlayerEquipped.set(Player, equippedItems);
		return equippedItems;
	},

	KnitInit() {
		print("Inventory Service Initialized | Server");
		Players.PlayerAdded.Connect((player) => {
			//this.FetchInventory(player);
		});

		Players.PlayerRemoving.Connect((player) => {
			this.PlayerInventories.delete(player);
			this.PlayerEquipped.delete(player);
		});
	},
});

export default InventoryService;
