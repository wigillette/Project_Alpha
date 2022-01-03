import { KnitServer as Knit, Signal, RemoteSignal } from "@rbxts/knit";
import { Players, ReplicatedStorage, Workspace } from "@rbxts/services";
import Database from "@rbxts/datastore2";
import InventoryService from "./InventoryService";
import LevelService from "./LevelService";

declare global {
	interface KnitServices {
		AssetService: typeof AssetService;
	}
}

interface AssetInfo {
	Position: CFrame;
	Name: string;
}

const AssetService = Knit.CreateService({
	Name: "AssetService",

	// Server-exposed Signals/Fields
	PlayerAssets: new Map<Player, AssetInfo[]>(),
	AssetsFolder: ReplicatedStorage.WaitForChild("Assets"),

	PlaceAsset(Player: Player, AssetName: string, Position: CFrame, Region: BasePart) {
		let response = `Failed to place ${AssetName}!`;
		const userAssetInfo = this.PlayerAssets.get(Player);
		const ownsAsset = InventoryService.ContainsItem(Player, AssetName, "Assets");
		const assetObject = this.AssetsFolder.FindFirstChild(AssetName);

		if (ownsAsset && assetObject && userAssetInfo) {
			// Clone the new object
			const newObject = assetObject.Clone() as BasePart;
			newObject.Parent = Workspace; // Change this to a folder for the user?
			newObject.CFrame = Position.ToObjectSpace(Region.CFrame);
			// Add experience
			LevelService.AddExp(Player, 10);
			// Update data
			userAssetInfo.push({ Position: Position, Name: AssetName });
			this.PlayerAssets.set(Player, userAssetInfo);
			this.UpdateAssetData(Player, userAssetInfo);
			// Update response
			response = `${AssetName} Placement Successful`;
		}

		return response;
	},

	LoadAssets(Player: Player, Region: BasePart) {
		const userAssetInfo = this.PlayerAssets.get(Player);
		let response = "Failed to load assets";
		if (userAssetInfo) {
			userAssetInfo.forEach((asset) => {
				const assetObject = this.AssetsFolder.FindFirstChild(asset.Name);
				if (assetObject) {
					const newObject = assetObject.Clone() as BasePart;
					newObject.Parent = Workspace; // Change this to a folder for the user?
					newObject.CFrame = asset.Position.ToObjectSpace(Region.CFrame);
				} else {
					print(`Failed to load ${asset.Name}!`);
				}
			});
			response = "Successfully loaded assets";
		}

		return response;
	},

	UpdateAssetData(Player: Player, AssetInfo: AssetInfo[]) {
		const AssetStore = Database("AssetInfo", Player);
		AssetStore.Set(AssetInfo);
	},

	InitData(Player: Player, AssetInfo: AssetInfo[]) {
		this.PlayerAssets.set(Player, AssetInfo);
	},

	KnitInit() {
		print("Asset Service Initialized | Server");
		Players.PlayerRemoving.Connect((player) => this.PlayerAssets.delete(player));
	},
});

export default AssetService;
