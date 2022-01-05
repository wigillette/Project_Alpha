import { KnitServer as Knit } from "@rbxts/knit";
import { Players, ReplicatedStorage, Workspace } from "@rbxts/services";
import Database from "@rbxts/datastore2";
import InventoryService from "./InventoryService";
import LevelService from "./LevelService";
import ObjectUtils from "@rbxts/object-utils";

declare global {
	interface KnitServices {
		AssetService: typeof AssetService;
	}
}

interface AssetInfo {
	Position: CFrame;
	Name: string;
}

interface SerializedInfo {
	Name: string;
	Position: LuaTuple<
		[number, number, number, number, number, number, number, number, number, number, number, number]
	>;
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
			const distance = Region.CFrame.Position.sub(Position.Position);

			if (distance.Magnitude <= 85) {
				// Check if it's within the distances
				// Clone the new object
				const assetFolder = this.RegionAssetsFolder.FindFirstChild(Region.Name);
				const newObject = assetObject.Clone() as Model;
				newObject.Parent = assetFolder; // Change this to a folder for the user?
				newObject.SetPrimaryPartCFrame(Position);
				// Add experience
				LevelService.AddExp(Player, 10);
				// Update data
				userAssetInfo.push({ Position: Position.ToObjectSpace(Region.CFrame), Name: AssetName });
				this.PlayerAssets.set(Player, userAssetInfo);
				this.UpdateAssetData(Player, userAssetInfo);
				// Update response
				response = `${AssetName} Placement Successful`;
			}
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
						const newObject = assetObject.Clone() as Model;
						newObject.Parent = assetFolder;
						newObject.SetPrimaryPartCFrame(asset.Position.ToObjectSpace(Region.CFrame));
					} else {
						print(`Failed to load ${asset.Name}!`);
					}
				});
			}
			response = "Successfully loaded assets";
		}

		return response;
	},

	RemoveAllAssets(Region: BasePart) {
		const assetFolder = this.RegionAssetsFolder.FindFirstChild(Region.Name);
		let response = "Region Assets folder does not exist!";
		if (assetFolder) {
			response = `Successfully removed all assets from the Region ${Region.Name} folder`;
			assetFolder.ClearAllChildren();
		}
		return response;
	},

	EncodeAssetInfo(AssetInfo: AssetInfo[]) {
		const serializedAssetInfo = [] as SerializedInfo[];
		AssetInfo.forEach((entry) => {
			serializedAssetInfo.push({ Name: entry.Name, Position: entry.Position.GetComponents() });
		});
		return serializedAssetInfo;
	},

	DecodeAssetInfo(AssetInfo: SerializedInfo[]) {
		const decodedAssetInfo = [] as AssetInfo[];
		let tuple: [number, number, number, number, number, number, number, number, number, number, number, number];
		AssetInfo.forEach((entry) => {
			tuple = entry.Position;
			decodedAssetInfo.push({ Name: entry.Name, Position: new CFrame(...tuple) });
		});

		return decodedAssetInfo;
	},

	UpdateAssetData(Player: Player, AssetInfo: AssetInfo[]) {
		const AssetStore = Database("AssetInfo", Player);
		AssetStore.Set(this.EncodeAssetInfo(AssetInfo));
	},

	InitData(Player: Player, AssetInfo: SerializedInfo[]) {
		this.PlayerAssets.set(Player, this.DecodeAssetInfo(AssetInfo));
	},

	KnitInit() {
		print("Asset Service Initialized | Server");
		Players.PlayerRemoving.Connect((player) => this.PlayerAssets.delete(player));
	},
});

export default AssetService;
