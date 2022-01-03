import { KnitClient as Knit } from "@rbxts/knit";
const RegionService = Knit.GetService("RegionService");
import { Workspace } from "@rbxts/services";
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
							if (clickDetector) {
								clickDetector.Destroy();
							}
						});
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
