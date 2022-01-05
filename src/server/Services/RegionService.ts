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
	Name: "RegionService",

	// Server-exposed Signals/Fields
	PlayerRegions: new Map<Player, BasePart>(),

	Client: {
		ClaimRegion(Player: Player, Key: BasePart) {
			return this.Server.ClaimRegion(Player, Key);
		},

		PlaceAsset(Player: Player, AssetName: string, Position: CFrame) {
			return this.Server.PlaceAsset(Player, AssetName, Position);
		},

		RemoveAsset(Player: Player, Asset: Model) {
			return this.Server.RemoveAsset(Player, Asset);
		},
		LoadAssets(Player: Player) {
			return this.Server.LoadAssets(Player);
		},

		GetRegions(Player: Player) {
			return this.Server.GetRegions();
		},

		ClearRegion(Player: Player) {
			return this.Server.ClearRegion(Player, true);
		},
	},

	ClaimRegion(Player: Player, Key: BasePart) {
		let canClaim = false;
		if (!this.PlayerRegions.has(Player)) {
			if (!ObjectUtils.values(this.PlayerRegions).includes(Key)) {
				this.PlayerRegions.set(Player, Key);
				AssetService.LoadAssets(Player, Key);
				print(`${Player.Name} has successfully claimed region ${Key.Name}!`);
				canClaim = true;
			} else {
				print(`${Player.Name} attempted to claim a region owned by someone else!`);
				canClaim = false;
			}
		} else {
			print(`${Player.Name} already has a region!`);
			canClaim = false;
		}
		return canClaim;
	},

	ClearRegion(Player: Player, save: boolean) {
		const userRegion = this.PlayerRegions.get(Player);
		let response = `${Player.Name} does not have a region!`;
		if (userRegion) {
			response = AssetService.RemoveAllAssets(Player, userRegion, save);
			print(response);
		}

		return response;
	},

	GetRegions() {
		return this.PlayerRegions;
	},

	LoadAssets(Player: Player) {
		const userRegion = this.PlayerRegions.get(Player);
		let toReturn = "You do not own a region!";
		if (userRegion) {
			toReturn = AssetService.LoadAssets(Player, userRegion);
		}
		return toReturn;
	},

	PlaceAsset(Player: Player, AssetName: string, Position: CFrame) {
		const userRegion = this.PlayerRegions.get(Player);
		let toReturn = "You do not own a region!";
		if (userRegion) {
			toReturn = AssetService.PlaceAsset(Player, AssetName, Position, userRegion);
		}
		return toReturn;
	},

	RemoveAsset(Player: Player, Asset: Model) {
		const userRegion = this.PlayerRegions.get(Player);
		let toReturn = "You do not own a region!";
		if (userRegion) {
			toReturn = AssetService.RemoveAsset(Player, Asset, userRegion);
		}
		return toReturn;
	},

	KnitInit() {
		print("Asset Service Initialized | Server");
		Players.PlayerRemoving.Connect((player) => {
			this.ClearRegion(player, false);
			this.PlayerRegions.delete(player);
		});
	},
});

export default RegionService;
