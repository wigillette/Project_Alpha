import { KnitClient as Knit } from "@rbxts/knit";
const RegionService = Knit.GetService("RegionService");
import AssetService from "./AssetService";
import { Workspace } from "@rbxts/services";
import ObjectUtils from "@rbxts/object-utils";
import ChatClient from "./ChatService";

const RegionClient = {
	equipped: {} as { Assets: string; Weapons: string },
	shadow: undefined as Model | undefined,
	ClaimRegion: (key: BasePart) => {
		print(`Attempting to claim region ${key.Name}!`);
		const canClaim = RegionService.ClaimRegion(key);
		return canClaim;
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
						ChatClient.PostFeedback(`You have selected Region ${baseRegion.Name}!`);
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

						AssetService.init(baseRegion);
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
