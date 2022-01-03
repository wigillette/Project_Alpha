import { KnitClient as Knit } from "@rbxts/knit";
const RegionService = Knit.GetService("RegionService");

const RegionClient = {
	ClaimRegion: (key: BasePart) => {
		print(`Attempting to claim ${key.Name}!`);
		RegionService.ClaimRegion(key);
	},
	PlaceAsset: (name: string, position: CFrame) => {
		print(`Attempting to place ${name} at ${position}!`);
		RegionService.PlaceAsset(name, position);
	},
	init: () => {
		print("Region Service Initialized | Client");
	},
};

export default RegionClient;
