import { KnitServer as Knit } from "@rbxts/knit";
import { Players } from "@rbxts/services";
import Database from "@rbxts/datastore2";
import GoldService from "./GoldService";
import InventoryService from "./InventoryService";
import LevelService from "./LevelService";
import ShopService from "./ShopService";
import AssetService from "./AssetService";
import LevelSettings from "../../shared/LevelSettings";

declare global {
	interface KnitServices {
		DatabaseService: typeof DatabaseService;
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

interface ProfileFormat {
	Level: number;
	Experience: number;
	ExperienceCap: number;
}

interface AssetInfo {
	Position: Vector3;
	Name: string;
}

const DatabaseService = Knit.CreateService({
	Name: "DatabaseService",

	LoadData(Player: Player) {
		print(`Attempting to load ${Player.Name}'s data`);
		const GoldStore = Database("Gold", Player);
		const Gold = GoldStore.GetAsync(0)
			.then((gold) => {
				GoldService.InitData(Player, gold as number);
				print(`Successfully loaded ${Player.Name}'s Gold`);
			})
			.catch((err) => {
				print(`Failed to load ${Player.Name}'s Gold`);
				print(err);
			});

		const InventoryStore = Database("Inventory", Player);
		const Inventory = InventoryStore.GetAsync({ Assets: [], Weapons: [] })
			.then((inventory) => {
				const EquippedItemsStore = Database("EquippedItems", Player);
				const EquippedItems = EquippedItemsStore.GetAsync({ Assets: "", Weapons: "" })
					.then((equipped) => {
						InventoryService.InitData(Player, inventory as InventoryFormat, equipped as EquippedFormat);
						print(`Successfully loaded ${Player.Name}'s Inventory`);
					})
					.catch((err) => {
						print(`Failed to load ${Player.Name}'s Equipped Items`);
						print(err);
					});
			})
			.catch((err) => {
				print(`Failed to load ${Player.Name}'s Inventory`);
				print(err);
			});

		const ProfileStore = Database("Profile", Player);
		const Profile = ProfileStore.GetAsync(LevelSettings.InitialProfile)
			.then((userProfile) => {
				LevelService.InitData(Player, userProfile as ProfileFormat);
				print(`Successfully loaded ${Player.Name}'s Profile Data`);
			})
			.catch((err) => {
				print(`Failed to load ${Player.Name}'s Profile Data`);
				print(err);
			});

		const AssetStore = Database("AssetInfo", Player);
		const AssetInfo = AssetStore.GetAsync([])
			.then((userAssets) => {
				AssetService.InitData(Player, userAssets as AssetInfo[]);
				print(`Successfully initialized ${Player.Name}'s Asset Data`);
			})
			.catch((err) => {
				print(`Failed to initialize ${Player.Name}'s Asset Data`);
				print(err);
			});

		ShopService.InitData(Player);
	},

	SaveData(Player: Player) {
		print(`Attempting to save ${Player.Name}'s data`);
		Database.SaveAllAsync(Player)
			.then(() => {
				print(`Successfully saved ${Player.Name}'s Data!`);
			})
			.catch((err) => {
				print(`Failed to save ${Player.Name}'s Data`);
				print(err);
			});
	},

	KnitInit() {
		Database.Combine("UserData", "Gold", "Inventory", "Profile", "EquippedItems", "AssetInfo");
		Players.PlayerAdded.Connect((player) => {
			this.LoadData(player);
		});
		print("Database Service Initialized | Server");
	},
});

export default DatabaseService;
