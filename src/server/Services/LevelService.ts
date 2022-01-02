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
			while (exp >= expCap) {
				level += 1;
				exp -= expCap;
				expCap = LevelSettings.CalculateCap(level);
				print(`${Player.Name} has leveled up! | Server`);
			}

			const newStats = { Experience: exp, Level: level, ExperienceCap: expCap };
			this.PlayerStats.set(Player, newStats);
			this.Client.StatsChanged.Fire(Player, newStats.Level, newStats.ExperienceCap, newStats.Experience);
		}
	},

	GetStats(Player: Player) {
		const stats = this.PlayerStats.get(Player);
		return stats ?? LevelSettings.InitialProfile;
	},

	InitData(Player: Player, UserStats: { Level: number; Experience: number; ExperienceCap: number }) {
		this.PlayerStats.set(Player, UserStats);
		this.Client.StatsChanged.Fire(Player, UserStats.Level, UserStats.ExperienceCap, UserStats.Experience);
	},

	KnitInit() {
		print("Level Service Initialized | Server");
		Players.PlayerRemoving.Connect((player) => this.PlayerStats.delete(player));
	},
});

export default LevelService;
