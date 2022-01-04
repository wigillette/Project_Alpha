import { KnitServer as Knit, Signal, RemoteSignal } from "@rbxts/knit";
import { Players } from "@rbxts/services";
import Database from "@rbxts/datastore2";

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
		EquippedChanged: new RemoteSignal<(Equipped: EquippedFormat) => void>(),
		FetchInventory(Player: Player) {
			return this.Server.FetchInventory(Player);
		},
		FetchEquipped(Player: Player) {
			return this.Server.FetchEquipped(Player);
		},
		EquipItem(Player: Player, ItemName: string, Category: string) {
			return this.Server.EquipItem(Player, ItemName, Category);
		},
	},

	AddToInventory(Player: Player, ItemName: string, Category: string) {
		const playerInventory = this.FetchInventory(Player);
		playerInventory[Category as keyof typeof playerInventory].push(ItemName);
		this.PlayerInventories.set(Player, playerInventory);
		this.UpdateInventoryData(Player, playerInventory);
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
		this.UpdateEquippedData(Player, equippedItems);
		return equippedItems;
	},

	UpdateInventoryData(Player: Player, newInventory: InventoryFormat) {
		const InventoryStore = Database("Inventory", Player);
		InventoryStore.Set(newInventory);
	},

	UpdateEquippedData(Player: Player, newEquippedItems: EquippedFormat) {
		const EquippedItemsStore = Database("EquippedItems", Player);
		EquippedItemsStore.Set(newEquippedItems);
	},

	InitData(Player: Player, Inventory: InventoryFormat, Equipped: EquippedFormat) {
		this.PlayerInventories.set(Player, Inventory);
		this.PlayerEquipped.set(Player, Equipped);
		this.Client.InventoryChanged.Fire(Player, Inventory);
		this.Client.EquippedChanged.Fire(Player, Equipped);
	},

	KnitInit() {
		print("Inventory Service Initialized | Server");
		Players.PlayerRemoving.Connect((player) => {
			this.PlayerInventories.delete(player);
			this.PlayerEquipped.delete(player);
		});
	},
});

export default InventoryService;
