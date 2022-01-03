import { KnitServer as Knit, Signal, RemoteSignal } from "@rbxts/knit";
import { Players } from "@rbxts/services";
import AssetService from "./AssetService";
import ObjectUtils from "@rbxts/object-utils";

declare global {
	interface KnitServices {
		RegionService: typeof RegionService;
	}
}

const RegionService = Knit.CreateService({
	Name: "AssetService",

	// Server-exposed Signals/Fields
	PlayerRegions: new Map<Player, BasePart>(),

	Client: {
		ClaimRegion(Player: Player, Key: BasePart) {
			return this.Server.ClaimRegion(Player, Key);
		},

		PlaceAsset(Player: Player, AssetName: string, Position: Vector3) {
			return this.Server.PlaceAsset(Player, AssetName, Position);
		},
	},

	ClaimRegion(Player: Player, Key: BasePart) {
		let response = "";
		if (!this.PlayerRegions.has(Player)) {
			if (!ObjectUtils.values(this.PlayerRegions).includes(Key)) {
				this.PlayerRegions.set(Player, Key);
				AssetService.LoadAssets(Player, Key);
				response = "Region successfully claimed!";
			} else {
				response = "Region is already claimed by someone else!";
			}
		} else {
			response = "You already have a region!";
		}
		return response;
	},

	PlaceAsset(Player: Player, AssetName: string, Position: Vector3) {
		const userRegion = this.PlayerRegions.get(Player);
		let toReturn = "You do not own a region!";
		if (userRegion) {
			toReturn = AssetService.PlaceAsset(Player, AssetName, Position, userRegion);
		}
		return toReturn;
	},

	KnitInit() {
		print("Asset Service Initialized | Server");
		Players.PlayerRemoving.Connect((player) => this.PlayerRegions.delete(player));
	},
});

export default RegionService;
