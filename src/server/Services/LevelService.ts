import { KnitServer as Knit, Signal, RemoteSignal } from "@rbxts/knit";
import { Players } from "@rbxts/services";
import LevelSettings from "../../shared/LevelSettings";

declare global {
	interface KnitServices {
		LevelService: typeof LevelService;
	}
}

const LevelService = Knit.CreateService({
	Name: "LevelService",

	// Server-exposed Signals/Fields
	PlayerStats: new Map<Player, { Level: number; Experience: number; ExperienceCap: number }>(),
	StatsChanged: new Signal<(Player: Player, Level: number, ExperienceCap: number, Experience: number) => void>(),

	Client: {
		StatsChanged: new RemoteSignal<(Level: number, ExperienceCap: number, Experience: number) => void>(),
		GiveExp: new RemoteSignal<() => void>(),
		GetStats(Player: Player) {
			return this.Server.GetStats(Player);
		},
	},

	AddExp(Player: Player, Amount: number) {
		if (Amount !== 0) {
			print(`Adding ${Amount} experience to ${Player.Name} | Server`);
			const stats = this.GetStats(Player);
			let exp = stats.Experience;
			let level = stats.Level;
			let expCap = stats.ExperienceCap;

			exp += Amount;
			if (exp >= expCap) {
				level += 1;
				exp -= expCap;
				expCap = LevelSettings.CalculateCap(level);
				print(`${Player.Name} has leveled up! | Server`);
			}

			const newStats = { Experience: exp, Level: level, ExperienceCap: expCap };
			this.PlayerStats.set(Player, newStats);
			this.StatsChanged.Fire(Player, newStats.Level, newStats.ExperienceCap, newStats.Experience);
			this.Client.StatsChanged.Fire(Player, newStats.Level, newStats.ExperienceCap, newStats.Experience);
		}
	},

	GetStats(Player: Player) {
		const stats = this.PlayerStats.get(Player);
		return stats ?? LevelSettings.InitialProfile;
	},

	KnitInit() {
		/*
		this.Client.GiveExp.Connect((player) => {
			this.AddExp(player, 50);
			print(`Gave ${player.Name} 50 exp`);
		});
		*/
		print("Level Service Initialized | Server");
		Players.PlayerAdded.Connect((player) => {
			print(`${player.Name} has entered the server!`);
			this.AddExp(player, 50);
		});

		Players.PlayerRemoving.Connect((player) => this.PlayerStats.delete(player));
	},
});

export default LevelService;
