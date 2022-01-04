import { KnitClient as Knit } from "@rbxts/knit";
const RegionService = Knit.GetService("RegionService");
const InventoryService = Knit.GetService("InventoryService");
import { Workspace, Players, ReplicatedStorage, UserInputService } from "@rbxts/services";
import ObjectUtils from "@rbxts/object-utils";

const RegionClient = {
	ClaimRegion: (key: BasePart) => {
		print(`Attempting to claim region ${key.Name}!`);
		const canClaim = RegionService.ClaimRegion(key);
		return canClaim;
	},
	PlaceAsset: (name: string, position: CFrame) => {
		print(`Attempting to place ${name} at ${position}!`);
		const response = RegionService.PlaceAsset(name, position);
		print(response);
	},
	RemoveAsset: (asset: BasePart) => {
		print(`Attempting to remove ${asset.Name}!`);
		const response = RegionService.RemoveAsset(asset);
		print(response);
	},
	LoadAssets: () => {
		print(`Attempting to load asset data onto the region`);
		const response = RegionService.LoadAssets();
		print(response);
	},
	initAssetPlacement: (region: BasePart) => {
		const clickDetector = region.FindFirstChildOfClass("ClickDetector");
		const mouse = Players.LocalPlayer.GetMouse();
		const assetsFolder = ReplicatedStorage.WaitForChild("Assets");
		const allAssetsFolders = Workspace.FindFirstChild("RegionAssets");

		function getMousePoint(X: number, Y: number, AssetsFolder: Folder) {
			const raycastParams = new RaycastParams();
			raycastParams.FilterType = Enum.RaycastFilterType.Blacklist;
			raycastParams.FilterDescendantsInstances = AssetsFolder.GetChildren();
			raycastParams.IgnoreWater = true;
			const camera = Workspace.CurrentCamera;
			if (camera) {
				const camray = camera.ScreenPointToRay(X, Y);
				const raycastResult = Workspace.Raycast(camray.Origin, camray.Direction.mul(2048), raycastParams);
				return raycastResult;
			}
		}

		if (allAssetsFolders) {
			const regionAssetsFolder = allAssetsFolders.FindFirstChild(region.Name) as Folder;
			if (regionAssetsFolder) {
				let equipped: { Assets: string; Weapons: string };
				let currentBlock: BasePart;
				let newShadow: BasePart | undefined;
				let mouseMoveConnection: RBXScriptConnection;
				let resultPosition: Vector3;
				let raycastResult: RaycastResult;
				let mouseLocation: Vector2;
				if (clickDetector) {
					clickDetector.MouseHoverEnter.Connect(() => {
						equipped = InventoryService.FetchEquipped();
						currentBlock = assetsFolder.FindFirstChild(equipped.Assets) as BasePart;
						if (currentBlock && newShadow === undefined) {
							newShadow = currentBlock.Clone() as BasePart;
							newShadow.Transparency = 0.75;
							newShadow.Parent = regionAssetsFolder;

							mouseMoveConnection = UserInputService.InputChanged.Connect((input, engine_processed) => {
								if (!engine_processed) {
									if (input.UserInputType === Enum.UserInputType.MouseMovement) {
										mouseLocation = UserInputService.GetMouseLocation();
										raycastResult = getMousePoint(
											mouseLocation.X,
											mouseLocation.Y,
											regionAssetsFolder,
										) as RaycastResult;
										if (raycastResult) {
											resultPosition = raycastResult.Position;
											if (newShadow) {
												newShadow.CFrame = new CFrame(resultPosition);
											}
										}
									}
								}
							});
						}
					});
					clickDetector.MouseHoverLeave.Connect(() => {
						if (newShadow) {
							newShadow.Destroy();
							newShadow = undefined;
						}
						if (mouseMoveConnection) {
							mouseMoveConnection.Disconnect();
						}
					});
					clickDetector.MouseClick.Connect(() => {
						if (equipped && newShadow) {
							RegionClient.PlaceAsset(equipped.Assets, newShadow.CFrame);
						}
					});
				}
			}
		}
	},
	initRegionSelection: () => {
		const regionData = RegionService.GetRegions();
		const regionFolder = Workspace.WaitForChild("Regions");
		const connections = [] as RBXScriptConnection[];

		regionFolder.GetChildren().forEach((region) => {
			const baseRegion = region as BasePart;
			if (!ObjectUtils.values(regionData).includes(baseRegion)) {
				const newDetector = new Instance("ClickDetector");
				newDetector.MaxActivationDistance = 1000;
				newDetector.Parent = baseRegion;
				const hoverEnter = newDetector.MouseHoverEnter.Connect(() => {
					baseRegion.BrickColor = new BrickColor("Bright green");
				});
				const hoverLeave = newDetector.MouseHoverLeave.Connect(() => {
					baseRegion.BrickColor = new BrickColor("Medium stone grey");
				});
				const onClick = newDetector.MouseClick.Connect(() => {
					const canClaim = RegionClient.ClaimRegion(baseRegion);
					if (canClaim) {
						baseRegion.BrickColor = new BrickColor("Medium stone grey");
						const selectionBox = new Instance("SelectionBox");
						selectionBox.Color3 = Color3.fromRGB(0, 255, 0);
						selectionBox.LineThickness = 0.3;
						selectionBox.Adornee = baseRegion;
						selectionBox.Visible = true;
						selectionBox.Parent = baseRegion;

						connections.forEach((connection) => {
							connection.Disconnect();
						});

						regionFolder.GetChildren().forEach((region) => {
							const clickDetector = region.FindFirstChildOfClass("ClickDetector");
							if (clickDetector && region !== baseRegion) {
								clickDetector.Destroy();
							}
						});

						RegionClient.LoadAssets();
						RegionClient.initAssetPlacement(baseRegion);
					}
				});
				connections.push(hoverEnter);
				connections.push(hoverLeave);
				connections.push(onClick);
			}
		});
	},
	init: () => {
		RegionClient.initRegionSelection();
		print("Region Service Initialized | Client");
	},
};

export default RegionClient;
