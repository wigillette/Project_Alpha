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
	RegionAssetsFolder: Workspace.WaitForChild("RegionAssets"),

	PlaceAsset(Player: Player, AssetName: string, Position: CFrame, Region: BasePart) {
		let response = `Failed to place ${AssetName}!`;
		const userAssetInfo = this.PlayerAssets.get(Player);
		const ownsAsset = InventoryService.ContainsItem(Player, AssetName, "Assets");
		const assetObject = this.AssetsFolder.FindFirstChild(AssetName);

		if (ownsAsset && assetObject && userAssetInfo) {
			// Clone the new object
			const assetFolder = this.RegionAssetsFolder.FindFirstChild(Region.Name);
			const newObject = assetObject.Clone() as BasePart;
			newObject.Parent = assetFolder; // Change this to a folder for the user?
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

	RemoveAsset(Player: Player, Asset: BasePart, Region: BasePart) {
		let response = `Failed to remove the asset`;
		const userAssetInfo = this.PlayerAssets.get(Player);
		const assetFolder = this.RegionAssetsFolder.FindFirstChild(Region.Name);
		if (userAssetInfo && assetFolder) {
			userAssetInfo.forEach((assetInfo) => {
				if (Asset && assetInfo.Name === Asset.Name && assetInfo.Position === Asset.CFrame) {
					Asset.Destroy();
					response = `${Player.Name} has successfully removed ${Asset.Name}`;
				}
			});
		}

		return response;
	},

	LoadAssets(Player: Player, Region: BasePart) {
		const userAssetInfo = this.PlayerAssets.get(Player);
		let response = "Failed to load assets";
		if (userAssetInfo) {
			const assetFolder = this.RegionAssetsFolder.FindFirstChild(Region.Name);
			if (assetFolder) {
				userAssetInfo.forEach((asset) => {
					const assetObject = this.AssetsFolder.FindFirstChild(asset.Name);
					if (assetObject) {
						const newObject = assetObject.Clone() as BasePart;
						newObject.Parent = assetFolder;
						newObject.CFrame = asset.Position.ToObjectSpace(Region.CFrame);
					} else {
						print(`Failed to load ${asset.Name}!`);
					}
				});
			}
			response = "Successfully loaded assets";
		}

		return response;
	},

	RemoveAllAssets(Player: Player, Region: BasePart) {
		const assetFolder = this.RegionAssetsFolder.FindFirstChild(Region.Name);
		let response = "Region Assets folder does not exist!";
		if (assetFolder) {
			response = `Successfully removed all assets from the Region ${Region.Name} folder`;
			assetFolder.ClearAllChildren();
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
