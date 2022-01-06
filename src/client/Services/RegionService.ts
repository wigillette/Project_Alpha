import { KnitClient as Knit } from "@rbxts/knit";
const RegionService = Knit.GetService("RegionService");
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
	equipped: {} as { Assets: string; Weapons: string },
	shadow: undefined as Model | undefined,
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
	RemoveAsset: (asset: Model) => {
		print(`Attempting to remove ${asset.Name}!`);
		const response = RegionService.RemoveAsset(asset);
		print(response);
	},
	LoadAssets: () => {
		print(`Attempting to load asset data onto the region`);
		const response = RegionService.LoadAssets();
		print(response);
	},
	HealAsset: (asset: Model) => {
		print(`Attempting to heal ${asset.Name}`);
		const response = RegionService.HealAsset(asset);
		print(response);
	},
	UpdateEquipped: (equipped: { Assets: string; Weapons: string }) => {
		RegionClient.equipped = equipped;
		if (RegionClient.shadow) {
			RegionClient.shadow.Destroy();
			RegionClient.shadow = undefined;
		}
	},
	ClearRegion: () => {
		print(`Clearing the assets from the region`);
		RegionService.ClearRegion();
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
		let USER_STATE = "NONE";
		let currentSelectionBox: SelectionBox | undefined;

		if (allAssetsFolders) {
			const regionAssetsFolder = allAssetsFolders.FindFirstChild(region.Name) as Folder;
			if (regionAssetsFolder) {
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

				const removeAsset = () => {
					const currentPart = mouse.Target;
					if (
						currentPart &&
						currentPart.Parent &&
						currentPart.Parent.IsA("Model") &&
						currentPart.IsDescendantOf(regionAssetsFolder)
					) {
						RegionClient.RemoveAsset(currentPart.Parent);
					}
				};

				const healAsset = () => {
					const currentPart = mouse.Target;
					if (
						currentPart &&
						currentPart.Parent &&
						currentPart.Parent.IsA("Model") &&
						currentPart.IsDescendantOf(regionAssetsFolder)
					) {
						RegionClient.HealAsset(currentPart.Parent);
					}
				};

				const buildMode = (name: string, state: Enum.UserInputState) => {
					if (name === "BUILD_MODE" && state === Enum.UserInputState.Begin && USER_STATE !== "BUILD_MODE") {
						USER_STATE = "BUILD_MODE";
						if (clickConnection !== undefined) {
							clickConnection.Disconnect();
						}
						clickConnection = UserInputService.InputBegan.Connect((input, engine) => {
							if (!engine) {
								if (
									input.UserInputType === Enum.UserInputType.MouseButton1 &&
									RegionClient.shadow &&
									RegionClient.shadow.PrimaryPart
								) {
									RegionClient.PlaceAsset(
										RegionClient.equipped.Assets,
										RegionClient.shadow.GetPrimaryPartCFrame(),
									);
								}
							}
						});
					}
				};

				const deleteMode = (name: string, state: Enum.UserInputState) => {
					if (name === "DELETE_MODE" && state === Enum.UserInputState.Begin) {
						if (USER_STATE !== "DELETE_MODE") {
							USER_STATE = "DELETE_MODE";
							if (clickConnection !== undefined) {
								clickConnection.Disconnect();
							}
							clickConnection = UserInputService.InputBegan.Connect((input, engine) => {
								if (!engine) {
									if (input.UserInputType === Enum.UserInputType.MouseButton1) {
										removeAsset();
									}
								}
							});
						}
					}
				};

				const healMode = (name: string, state: Enum.UserInputState) => {
					if (name === "HEAL_MODE" && state === Enum.UserInputState.Begin) {
						if (USER_STATE !== "HEAL_MODE") {
							USER_STATE = "HEAL_MODE";
							if (clickConnection !== undefined) {
								clickConnection.Disconnect();
							}
							clickConnection = UserInputService.InputBegan.Connect((input, engine) => {
								if (!engine) {
									if (input.UserInputType === Enum.UserInputType.MouseButton1) {
										healAsset();
									}
								}
							});
						}
					}
				};

				const leaveMode = (name: string, state: Enum.UserInputState) => {
					if (name === "LEAVE_MODE" && state === Enum.UserInputState.Begin) {
						USER_STATE = "NONE";
						if (RegionClient.shadow) {
							RegionClient.shadow.Destroy();
						}
						if (currentSelectionBox) {
							currentSelectionBox.Destroy();
						}
					}
				};

				ContextActionService.BindAction("ROTATE_X", rotateX, true, Enum.KeyCode.R);
				ContextActionService.BindAction("ROTATE_Y", rotateY, true, Enum.KeyCode.T);
				ContextActionService.BindAction("CLEAR", RegionClient.ClearRegion, true, Enum.KeyCode.F);
				ContextActionService.BindAction("DELETE_MODE", deleteMode, true, Enum.KeyCode.E);
				ContextActionService.BindAction("BUILD_MODE", buildMode, true, Enum.KeyCode.B);
				ContextActionService.BindAction("LEAVE_MODE", leaveMode, true, Enum.KeyCode.Z);
				ContextActionService.BindAction("HEAL_MODE", healMode, true, Enum.KeyCode.X);

				let currentBlock: Model;

				const addingHover = false;

				let clickConnection: RBXScriptConnection | undefined;
				const renderConnection = RunService.RenderStepped.Connect(() => {
					if (mouse.Target) {
						if (mouse.Target === region || mouse.Target.IsDescendantOf(regionAssetsFolder)) {
							if (USER_STATE === "BUILD_MODE") {
								if (currentSelectionBox) {
									currentSelectionBox.Destroy();
									currentSelectionBox = undefined;
								}
								if (RegionClient.shadow && RegionClient.shadow.PrimaryPart) {
									const unitRay = Workspace.CurrentCamera?.ScreenPointToRay(mouse.X, mouse.Y);
									const ray = new Ray(unitRay?.Origin, unitRay?.Direction.mul(500));
									const rayInfo = Workspace.FindPartOnRay(ray, RegionClient.shadow);
									const pos = rayInfo[1];
									const normal = rayInfo[2];
									const platformBottom = region.CFrame.add(
										region.CFrame.UpVector.mul(region.Size.Y).mul(0.5),
									);
									const max = new Vector3(region.Size.X, HEIGHT, region.Size.Z);
									const min = new Vector3(-max.X, 0, -max.Z);

									const lrot = CFrame.Angles(rotX, rotY, 0);
									let lsize = lrot.mul(RegionClient.shadow.GetExtentsSize()).mul(-1);
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
									RegionClient.shadow.SetPrimaryPartCFrame(
										platformBottom.ToWorldSpace(lrot.add(lpos)),
									);
								} else {
									currentBlock = assetsFolder.FindFirstChild(RegionClient.equipped.Assets) as Model;
									RegionClient.shadow = currentBlock.Clone();
									RegionClient.shadow.Name = "Hover";
									RegionClient.shadow.GetChildren().forEach((child) => {
										if (child.IsA("BasePart")) {
											child.Transparency = 0.75;
											child.CanCollide = false;
										}
									});
									RegionClient.shadow.Parent = regionAssetsFolder;
								}
							} else if (USER_STATE === "DELETE_MODE") {
								if (RegionClient.shadow) {
									RegionClient.shadow.Destroy();
									RegionClient.shadow = undefined;
								}
								if (
									mouse.Target.Parent &&
									mouse.Target.Parent.IsA("Model") &&
									mouse.Target.Parent.PrimaryPart &&
									!mouse.Target.Parent.FindFirstChild("Delete")
								) {
									if (currentSelectionBox) {
										currentSelectionBox.Destroy();
										currentSelectionBox = undefined;
									}
									currentSelectionBox = new Instance("SelectionBox");
									currentSelectionBox.Name = "Delete";
									currentSelectionBox.Color3 = Color3.fromRGB(255, 0, 0);
									currentSelectionBox.LineThickness = 0.3;
									currentSelectionBox.Adornee = mouse.Target.Parent.PrimaryPart;
									currentSelectionBox.Parent = mouse.Target.Parent;
								}
							} else if (USER_STATE === "HEAL_MODE") {
								if (RegionClient.shadow) {
									RegionClient.shadow.Destroy();
									RegionClient.shadow = undefined;
								}
								if (
									mouse.Target.Parent &&
									mouse.Target.Parent.IsA("Model") &&
									mouse.Target.Parent.PrimaryPart &&
									!mouse.Target.Parent.FindFirstChild("Heal")
								) {
									if (currentSelectionBox) {
										currentSelectionBox.Destroy();
										currentSelectionBox = undefined;
									}
									currentSelectionBox = new Instance("SelectionBox");
									currentSelectionBox.Name = "Heal";
									currentSelectionBox.Color3 = Color3.fromRGB(0, 255, 0);
									currentSelectionBox.LineThickness = 0.3;
									currentSelectionBox.Adornee = mouse.Target.Parent.PrimaryPart;
									currentSelectionBox.Parent = mouse.Target.Parent;
								}
							}
						} else {
							if (RegionClient.shadow) {
								RegionClient.shadow.Destroy();
							}
							if (currentSelectionBox) {
								currentSelectionBox.Destroy();
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
							if (clickDetector) {
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
