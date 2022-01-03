import { KnitServer as Knit, Signal, RemoteSignal } from "@rbxts/knit";
import { Players } from "@rbxts/services";
import Database from "@rbxts/datastore2";

declare global {
	interface KnitServices {
		AssetService: typeof AssetService;
	}
}

interface AssetInfo {
	Position: Vector3;
	Name: string;
}

const AssetService = Knit.CreateService({
	Name: "AssetService",

	// Server-exposed Signals/Fields
	PlayerAssets: new Map<Player, AssetInfo[]>(),

	PlaceAsset(Player: Player, AssetName: string, Position: Vector3, Region: BasePart) {
		const response = `You do not own a ${AssetName}!`;
		// TO-DO: Place the user's asset at the respective position
		// 1. Check if the user owns the asset
		//      2. Place the asset
		//      3. Add Exp to the user using the LevelService
		//      4. Save the asset to the user's AssetInfo in the database (using UpdateAssetData)
		//      5. Return a response string
		return response;
	},

	LoadAssets(Player: Player, Region: BasePart) {
		// TO-DO: Load the player's assets onto their baseplate by getting their assets in PlayerAssets
	},

	UpdateAssetData(Player: Player, AssetInfo: AssetInfo[]) {
		const AssetStore = Database("AssetInfo", Player);
		AssetStore.Set(AssetInfo);
	},

	InitData(Player: Player, AssetInfo: AssetInfo[]) {
		this.PlayerAssets.set(Player, AssetInfo);
	},

	KnitInit() {
		print("Asset Service Initialized | Server");
		Players.PlayerRemoving.Connect((player) => this.PlayerAssets.delete(player));
	},
});

export default AssetService;
