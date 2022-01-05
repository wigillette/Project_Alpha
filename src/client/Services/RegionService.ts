import { KnitClient as Knit } from "@rbxts/knit";
const RegionService = Knit.GetService("RegionService");
const InventoryService = Knit.GetService("InventoryService");
import {
	Workspace,
	Players,
	ReplicatedStorage,
	UserInputService,
	RunService,
	ContextActionService,
} from "@rbxts/services";
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
		const mouse = Players.LocalPlayer.GetMouse();
		const assetsFolder = ReplicatedStorage.WaitForChild("Assets");
		const allAssetsFolders = Workspace.FindFirstChild("RegionAssets");
		const HEIGHT = 300;
		const GRID_SIZE = 2;
		let _rotX = 0;
		let _rotY = 0;
		let rotX = 0;
		let rotY = 0;

		const roundTo = (input: number, roundNum: number) => {
			return input - (input % roundNum);
		};

		const rotateX = (name: string, state: Enum.UserInputState) => {
			if (name === "ROTATE_X" && state === Enum.UserInputState.Begin) {
				_rotX = (_rotX + 1) % 4;
				rotX = _rotX * math.pi * 0.5;
			}
		};

		const rotateY = (name: string, state: Enum.UserInputState) => {
			if (name === "ROTATE_Y" && state === Enum.UserInputState.Begin) {
				_rotY = (_rotY + 1) % 4;
				rotY = _rotY * math.pi * 0.5;
			}
		};

		ContextActionService.BindAction("ROTATE_X", rotateX, true, Enum.KeyCode.R);
		ContextActionService.BindAction("ROTATE_Y", rotateY, true, Enum.KeyCode.T);

		if (allAssetsFolders) {
			const regionAssetsFolder = allAssetsFolders.FindFirstChild(region.Name) as Folder;
			if (regionAssetsFolder) {
				let equipped: { Assets: string; Weapons: string } = InventoryService.FetchEquipped();
				let currentBlock: Model = assetsFolder.FindFirstChild(equipped.Assets) as Model;
				let shadow: Model | undefined = currentBlock.Clone();
				let addingHover = false;
				shadow.Name = "Hover";
				shadow.GetChildren().forEach((child) => {
					if (child.IsA("BasePart")) {
						child.Transparency = 0.75;
						child.CanCollide = false;
					}
				});
				shadow.Parent = regionAssetsFolder;
				let clickConnection: RBXScriptConnection | undefined;
				const renderConnection = RunService.RenderStepped.Connect(() => {
					if (mouse.Target) {
						if (mouse.Target === region || mouse.Target.IsDescendantOf(regionAssetsFolder)) {
							if (shadow && shadow.PrimaryPart) {
								const unitRay = Workspace.CurrentCamera?.ScreenPointToRay(mouse.X, mouse.Y);
								const ray = new Ray(unitRay?.Origin, unitRay?.Direction.mul(500));
								const rayInfo = Workspace.FindPartOnRay(ray, shadow);
								const pos = rayInfo[1];
								const normal = rayInfo[2];
								const platformBottom = region.CFrame.add(
									region.CFrame.UpVector.mul(region.Size.Y).mul(0.5),
								);
								const max = new Vector3(region.Size.X, HEIGHT, region.Size.Z);
								const min = new Vector3(-max.X, 0, -max.Z);

								const lrot = CFrame.Angles(rotX, rotY, 0);
								let lsize = lrot.mul(shadow.GetExtentsSize()).mul(-1);
								lsize = new Vector3(math.abs(lsize.X), math.abs(lsize.Y), math.abs(lsize.Z));
								const lmax = max.sub(lsize).mul(0.5);
								const lmin = min.add(lsize).mul(0.5);
								const offset = normal.mul(lsize).mul(0.5);
								let lpos = platformBottom.PointToObjectSpace(pos.add(offset));
								lpos = new Vector3(
									math.clamp(lpos.X, lmin.X, lmax.X),
									math.clamp(lpos.Y, lmin.Y, lmax.Y),
									math.clamp(lpos.Z, lmin.Z, lmax.Z),
								);
								lpos = new Vector3(
									math.sign(lpos.X) *
										(math.abs(lpos.X) - (math.abs(lpos.X) % GRID_SIZE) + (lmin.X % GRID_SIZE)),
									math.sign(lpos.Y) *
										(math.abs(lpos.Y) - (math.abs(lpos.Y) % GRID_SIZE) + (lmin.Y % GRID_SIZE)),
									math.sign(lpos.Z) *
										(math.abs(lpos.Z) - (math.abs(lpos.Z) % GRID_SIZE) + (lmin.Z % GRID_SIZE)),
								);
								shadow.SetPrimaryPartCFrame(platformBottom.ToWorldSpace(lrot.add(lpos)));
								if (clickConnection === undefined) {
									clickConnection = UserInputService.InputBegan.Connect((input, engine) => {
										if (!engine) {
											if (input.UserInputType === Enum.UserInputType.MouseButton1 && shadow) {
												RegionClient.PlaceAsset(equipped.Assets, shadow.GetPrimaryPartCFrame());
											}
										}
									});
								}
							} else {
								if (!addingHover && !regionAssetsFolder.FindFirstChild("Hover")) {
									addingHover = true;
									equipped = InventoryService.FetchEquipped();
									currentBlock = assetsFolder.FindFirstChild(equipped.Assets) as Model;
									shadow = currentBlock.Clone();
									shadow.Name = "Hover";
									shadow.GetChildren().forEach((child) => {
										if (child.IsA("BasePart")) {
											child.Transparency = 0.75;
											child.CanCollide = false;
										}
									});
									shadow.Parent = regionAssetsFolder;
									addingHover = false;
								}
							}
						} else {
							if (shadow) {
								shadow.Destroy();
								shadow = undefined;
							}
							if (clickConnection) {
								clickConnection.Disconnect();
								clickConnection = undefined;
							}
						}
					}
				});
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
				newDetector.CursorIcon = "rbxassetid://";
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
