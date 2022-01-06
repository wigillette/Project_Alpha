import { KnitServer as Knit } from "@rbxts/knit";
import { Players, ReplicatedStorage, Workspace, TweenService } from "@rbxts/services";
import Database from "@rbxts/datastore2";
import InventoryService from "./InventoryService";
import LevelService from "./LevelService";
import ObjectUtils from "@rbxts/object-utils";
import ShopItems from "../../shared/ShopItems";
import GoldService from "./GoldService";

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
				const objectInfo = ShopItems[AssetName as keyof typeof ShopItems];
				if (newObject && objectInfo && !this.isColliding(newObject)) {
					const health = new Instance("NumberValue");
					health.Name = "ObjectHealth";
					health.Value = objectInfo.Health;
					health.Parent = newObject;
					const healthConnection = health.GetPropertyChangedSignal("Value").Connect(() => {
						if (health.Value <= 0) {
							GoldService.AddGold(Player, -25);
							let tween: Tween;
							newObject.GetChildren().forEach((child) => {
								if (child.IsA("BasePart")) {
									tween = TweenService.Create(
										child as BasePart,
										new TweenInfo(
											0.4,
											Enum.EasingStyle.Quad,
											Enum.EasingDirection.Out,
											0,
											false,
											0,
										),
										{ Transparency: 1 },
									);
									tween.Play();
								}
							});
							wait(0.45);
							const resp = this.RemoveAsset(Player, newObject, Region);
							print(resp);
							healthConnection.Disconnect();
						}
					});
					newObject.Parent = assetFolder;
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
		}

		return response;
	},

	isColliding(model: Model) {
		const primaryPart = model.PrimaryPart;
		if (primaryPart) {
			const touch = primaryPart.Touched.Connect(() => {});
			const touching = primaryPart.GetTouchingParts();
			let isColliding = false;
			touching.forEach((part) => {
				if (!isColliding && !part.IsDescendantOf(model)) {
					isColliding = true;
				}
			});

			touch.Disconnect();
			return isColliding;
		}
	},

	RemoveAsset(Player: Player, Asset: Model, Region: BasePart) {
		let response = `Failed to remove the asset`;
		const userAssetInfo = this.PlayerAssets.get(Player);
		const assetFolder = this.RegionAssetsFolder.FindFirstChild(Region.Name);
		if (userAssetInfo && assetFolder) {
			userAssetInfo.forEach((assetInfo, index) => {
				if (
					Asset &&
					assetInfo.Name === Asset.Name &&
					Asset.PrimaryPart &&
					(assetInfo.Position.ToObjectSpace(Region.CFrame) === Asset.GetPrimaryPartCFrame() ||
						assetInfo.Position === Asset.GetPrimaryPartCFrame())
				) {
					Asset.Destroy();
					userAssetInfo.remove(index);
					this.PlayerAssets.set(Player, userAssetInfo);
					this.UpdateAssetData(Player, userAssetInfo);
					response = `${Player.Name} has successfully removed ${Asset.Name}`;
				}
			});
		}

		return response;
	},

	HealAsset(Player: Player, Asset: Model, Region: BasePart) {
		const assetFolder = this.RegionAssetsFolder.FindFirstChild(Region.Name);
		let response = `Failed to heal ${Asset.Name}`;
		if (Asset && assetFolder && Asset.IsDescendantOf(assetFolder)) {
			const objectInfo = ShopItems[Asset.Name as keyof typeof ShopItems];
			const objectHealth = Asset.FindFirstChild("ObjectHealth", true) as NumberValue;
			if (objectHealth && objectHealth.Value < objectInfo.Health) {
				objectHealth.Value = math.min(objectHealth.Value + 15, objectInfo.Health);
				GoldService.AddGold(Player, -10);
				response = `Successfully healed ${Asset.Name}!`;
			}
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
						const objectInfo = ShopItems[asset.Name as keyof typeof ShopItems];
						const newObject = assetObject.Clone() as Model;
						const health = new Instance("NumberValue");
						health.Name = "ObjectHealth";
						health.Value = objectInfo.Health;
						health.Parent = newObject;
						const healthConnection = health.GetPropertyChangedSignal("Value").Connect(() => {
							if (health.Value <= 0) {
								GoldService.AddGold(Player, -25);
								let tween: Tween;
								newObject.GetChildren().forEach((child) => {
									if (child.IsA("BasePart")) {
										tween = TweenService.Create(
											child as BasePart,
											new TweenInfo(
												0.4,
												Enum.EasingStyle.Quad,
												Enum.EasingDirection.Out,
												0,
												false,
												0,
											),
											{ Transparency: 1 },
										);
										tween.Play();
									}
								});
								wait(0.45);
								const resp = this.RemoveAsset(Player, newObject, Region);
								print(resp);
								healthConnection.Disconnect();
							}
						});
						newObject.Parent = assetFolder;
						newObject.SetPrimaryPartCFrame(asset.Position.ToObjectSpace(Region.CFrame));
					} else {
						print(`Failed to load ${asset.Name}!`);
					}
				});
				response = "Successfully loaded assets";
			}
		}

		return response;
	},

	RemoveAllAssets(Player: Player, Region: BasePart, save: boolean) {
		const assetFolder = this.RegionAssetsFolder.FindFirstChild(Region.Name);
		let response = "Region Assets folder does not exist!";
		if (assetFolder) {
			response = `Successfully removed all assets from the Region ${Region.Name} folder`;
			if (save) {
				this.UpdateAssetData(Player, [] as AssetInfo[]);
				this.PlayerAssets.set(Player, [] as AssetInfo[]);
			}
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
