import { KnitServer as Knit, Signal, RemoteSignal } from "@rbxts/knit";
import { Players } from "@rbxts/services";

declare global {
	interface KnitServices {
		GoldService: typeof GoldService;
	}
}

const GoldService = Knit.CreateService({
	Name: "GoldService",

	// Server-exposed Signals/Fields
	PlayerGold: new Map<Player, number>(),
	GoldChanged: new Signal<(Player: Player, Gold: number) => void>(),

	Client: {
		GoldChanged: new RemoteSignal<(Gold: number) => void>(),
		GiveGold: new RemoteSignal<() => void>(),
		GetGold(Player: Player) {
			return this.Server.GetGold(Player);
		},
	},

	AddGold(Player: Player, Amount: number) {
		if (Amount !== 0) {
			print(`Adding ${Amount} gold to ${Player.Name} | Server`);
			const gold = this.GetGold(Player);
			const newGold = gold + Amount;

			this.PlayerGold.set(Player, newGold);
			this.GoldChanged.Fire(Player, newGold);
			this.Client.GoldChanged.Fire(Player, newGold);
		}
	},

	GetGold(Player: Player) {
		const gold = this.PlayerGold.get(Player);
		return gold ?? 0;
	},

	KnitInit() {
		print("Gold Service Initialized | Server");
		Players.PlayerAdded.Connect((player) => {
			print(`${player.Name} has entered the server!`);
			this.AddGold(player, 50);
		});

		Players.PlayerRemoving.Connect((player) => this.PlayerGold.delete(player));
	},
});

export default GoldService;