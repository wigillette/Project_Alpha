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

const AssetClient = {
	equipped: {} as { Assets: string; Weapons: string },
	shadow: undefined as Model | undefined,
	rotation: { X: 0, Y: 0 },
	region: undefined as BasePart | undefined,
	_rotation: { X: 0, Y: 0 },
	USER_STATE: "NONE",
	currentSelectionBox: undefined as SelectionBox | undefined,
	HEIGHT: 300,
	GRID_SIZE: 2,
	allAssetsFolder: Workspace.WaitForChild("RegionAssets"),
	assetsFolder: ReplicatedStorage.WaitForChild("Assets"),
	mouse: Players.LocalPlayer.GetMouse(),
	clickConnection: undefined as RBXScriptConnection | undefined,
	regionAssetsFolder: undefined as Folder | undefined,

	// Remote Handlers
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
		AssetClient.equipped = equipped;
		AssetClient.CleanUp();
		AssetClient.CreateShadow();
	},
	ClearRegion: () => {
		print(`Clearing the assets from the region`);
		RegionService.ClearRegion();
	},
	// Asset Managers
	RotateX: (name: string, state: Enum.UserInputState) => {
		if (name === "ROTATE_X" && state === Enum.UserInputState.Begin) {
			AssetClient._rotation.X = (AssetClient._rotation.X + 1) % 4;
			AssetClient.rotation.X = AssetClient._rotation.X * (math.pi / 2);
		}
	},
	RotateY: (name: string, state: Enum.UserInputState) => {
		if (name === "ROTATE_Y" && state === Enum.UserInputState.Begin) {
			AssetClient._rotation.Y = (AssetClient._rotation.Y + 1) % 4;
			AssetClient.rotation.Y = AssetClient._rotation.Y * (math.pi / 2);
		}
	},
	ChangeState: (state: string) => {
		let isNewState = false;
		if (AssetClient.USER_STATE !== state) {
			isNewState = true;
			AssetClient.USER_STATE = state;
			if (AssetClient.clickConnection) {
				AssetClient.clickConnection.Disconnect();
				AssetClient.clickConnection = undefined;
			}
		}
		return isNewState;
	},
	InitConnection: (callback: () => void) => {
		if (!AssetClient.clickConnection) {
			AssetClient.clickConnection = UserInputService.InputBegan.Connect((input, engine) => {
				if (!engine) {
					if (input.UserInputType === Enum.UserInputType.MouseButton1) {
						callback();
					}
				}
			});
		}
	},
	CreateShadow: () => {
		const currentBlock = AssetClient.assetsFolder.FindFirstChild(AssetClient.equipped.Assets) as Model;
		if (currentBlock) {
			AssetClient.shadow = currentBlock.Clone();
			AssetClient.shadow.Name = "Hover";
			AssetClient.shadow.GetChildren().forEach((child) => {
				if (child.IsA("BasePart")) {
					child.Transparency = 0.75;
					child.CanCollide = false;
				}
			});
			AssetClient.shadow.Parent = AssetClient.regionAssetsFolder;
		}
	},
	BuildMode: () => {
		const isNewState = AssetClient.ChangeState("BUILD_MODE");
		if (isNewState) {
			AssetClient.CleanUp();
			// Create Shadow
			AssetClient.CreateShadow();
			// Initialize click connection
			AssetClient.InitConnection(() => {
				if (AssetClient.shadow && AssetClient.shadow.PrimaryPart) {
					AssetClient.PlaceAsset(AssetClient.equipped.Assets, AssetClient.shadow.GetPrimaryPartCFrame());
				}
			});
		}
	},
	GetTarget: () => {
		let target = undefined as Model | undefined;
		const currentPart = AssetClient.mouse.Target as BasePart | undefined;
		if (
			currentPart &&
			currentPart.Parent &&
			currentPart.Parent.IsA("Model") &&
			currentPart.IsDescendantOf(AssetClient.regionAssetsFolder as Folder)
		) {
			target = currentPart.Parent;
		}
		return target;
	},
	DeleteMode: () => {
		const isNewState = AssetClient.ChangeState("DELETE_MODE");
		if (isNewState) {
			AssetClient.CleanUp();
			AssetClient.InitConnection(() => {
				const target = AssetClient.GetTarget() as Model;
				if (target) {
					AssetClient.RemoveAsset(target);
				}
			});
		}
	},
	HealMode: () => {
		const isNewState = AssetClient.ChangeState("HEAL_MODE");
		if (isNewState) {
			AssetClient.InitConnection(() => {
				const target = AssetClient.GetTarget() as Model;
				if (target) {
					AssetClient.HealAsset(target);
				}
			});
		}
	},
	CleanUp: () => {
		if (AssetClient.shadow) {
			AssetClient.shadow.Destroy();
			AssetClient.shadow = undefined;
		}
		if (AssetClient.currentSelectionBox) {
			AssetClient.currentSelectionBox.Destroy();
			AssetClient.currentSelectionBox = undefined;
		}
	},
	LeaveMode: () => {
		const isNewState = AssetClient.ChangeState("NONE");
		if (isNewState) {
			AssetClient.CleanUp();
		}
	},

	UpdateShadow: () => {
		if (AssetClient.shadow && AssetClient.region && AssetClient.shadow.PrimaryPart) {
			const unitRay = Workspace.CurrentCamera?.ScreenPointToRay(AssetClient.mouse.X, AssetClient.mouse.Y);
			if (unitRay) {
				const ray = new Ray(unitRay.Origin, unitRay.Direction.mul(500));
				const rayInfo = Workspace.FindPartOnRay(ray, AssetClient.shadow);
				const pos = rayInfo[1];
				const normal = rayInfo[2];
				const platformBottom = AssetClient.region.CFrame.add(
					AssetClient.region.CFrame.UpVector.mul(AssetClient.region.Size.Y).mul(0.5),
				);
				const max = new Vector3(AssetClient.region.Size.X, AssetClient.HEIGHT, AssetClient.region.Size.Z);
				const min = new Vector3(-max.X, 0, -max.Z);

				const lrot = CFrame.Angles(AssetClient.rotation.X, AssetClient.rotation.Y, 0);
				let lsize = lrot.mul(AssetClient.shadow.GetExtentsSize()).mul(-1);
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
						(math.abs(lpos.X) -
							(math.abs(lpos.X) % AssetClient.GRID_SIZE) +
							(lmin.X % AssetClient.GRID_SIZE)),
					math.sign(lpos.Y) *
						(math.abs(lpos.Y) -
							(math.abs(lpos.Y) % AssetClient.GRID_SIZE) +
							(lmin.Y % AssetClient.GRID_SIZE)),
					math.sign(lpos.Z) *
						(math.abs(lpos.Z) -
							(math.abs(lpos.Z) % AssetClient.GRID_SIZE) +
							(lmin.Z % AssetClient.GRID_SIZE)),
				);
				AssetClient.shadow.SetPrimaryPartCFrame(platformBottom.ToWorldSpace(lrot.add(lpos)));
			}
		}
	},

	AddSelectionBox: (Type: string, Color: Color3, Target: Instance) => {
		if (
			Target.Parent &&
			Target.Parent.IsA("Model") &&
			Target.Parent.PrimaryPart &&
			!Target.Parent.FindFirstChild("Heal")
		) {
			if (AssetClient.currentSelectionBox) {
				AssetClient.currentSelectionBox.Destroy();
				AssetClient.currentSelectionBox = undefined;
			}
			AssetClient.currentSelectionBox = new Instance("SelectionBox");
			AssetClient.currentSelectionBox.Name = Type;
			AssetClient.currentSelectionBox.Color3 = Color;
			AssetClient.currentSelectionBox.LineThickness = 0.3;
			AssetClient.currentSelectionBox.Adornee = Target.Parent.PrimaryPart;
			AssetClient.currentSelectionBox.Parent = Target.Parent;
		}
	},

	// Initialize
	init: (region: BasePart) => {
		AssetClient.region = region;
		AssetClient.regionAssetsFolder = AssetClient.allAssetsFolder.FindFirstChild(region.Name) as Folder;
		if (AssetClient.regionAssetsFolder) {
			// Initialize Action Handler Keybinds
			ContextActionService.BindAction("ROTATE_X", AssetClient.RotateX, true, Enum.KeyCode.R);
			ContextActionService.BindAction("ROTATE_Y", AssetClient.RotateY, true, Enum.KeyCode.T);
			ContextActionService.BindAction("CLEAR", AssetClient.ClearRegion, true, Enum.KeyCode.F);
			ContextActionService.BindAction("DELETE_MODE", AssetClient.DeleteMode, true, Enum.KeyCode.E);
			ContextActionService.BindAction("BUILD_MODE", AssetClient.BuildMode, true, Enum.KeyCode.B);
			ContextActionService.BindAction("LEAVE_MODE", AssetClient.LeaveMode, true, Enum.KeyCode.Z);
			ContextActionService.BindAction("HEAL_MODE", AssetClient.HealMode, true, Enum.KeyCode.X);

			// Initialize Hover RenderStepped
			const renderConnection = RunService.RenderStepped.Connect(() => {
				const target = AssetClient.mouse.Target;
				if (
					target &&
					AssetClient.regionAssetsFolder &&
					(target === region || target.IsDescendantOf(AssetClient.regionAssetsFolder))
				) {
					switch (AssetClient.USER_STATE) {
						case "BUILD_MODE":
							if (!AssetClient.shadow) {
								AssetClient.CreateShadow();
							}
							AssetClient.UpdateShadow();
							break;
						case "DELETE_MODE":
							AssetClient.AddSelectionBox("Delete", Color3.fromRGB(255, 0, 0), target);
							break;
						case "HEAL_MODE":
							AssetClient.AddSelectionBox("Heal", Color3.fromRGB(0, 255, 0), target);
							break;
					}
				} else {
					AssetClient.CleanUp();
				}
			});
		}
	},
};

export default AssetClient;
