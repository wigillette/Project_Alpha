import { KnitServer as Knit, Signal, RemoteProperty, RemoteSignal } from "@rbxts/knit";
import { Players } from "@rbxts/services";

declare global {
	interface KnitServices {
		LevelService: typeof LevelService;
	}
}

const LevelService = Knit.CreateService({
	Name: "LevelService",

	// Server-exposed Signals/Fields
	PlayerStats: new Map<Player, { Level: number; Experience: number; ExperienceCap: number }>(),
	ExpChanged: new Signal<(Player: Player, Experience: number) => void>(),
	LevelChanged: new Signal<(Player: Player, Level: number, ExperienceCap: number) => void>(),

	Client: {
		ExpChanged: new RemoteSignal<(Experience: number) => void>(),
		LevelChanged: new RemoteSignal<(Level: number, ExperienceCap: number) => void>(),
		GiveExp: new RemoteSignal<() => void>(),
		GetStats(Player: Player) {
			return this.Server.GetStats(Player);
		},
	},

	AddExp(Player: Player, Amount: number) {
		if (Amount !== 0) {
			const stats = this.GetStats(Player);
			let exp = stats.Experience;
			let level = stats.Level;
			let expCap = stats.ExperienceCap;
			let newStats;

			exp += Amount;
			if (exp >= expCap) {
				level += 1;
				expCap = math.pow(level, 1.5) * 50;
				newStats = { Experience: exp, Level: level, ExperienceCap: expCap };
				this.PlayerStats.set(Player, newStats);
				this.ExpChanged.Fire(Player, newStats.Experience);
				this.LevelChanged.Fire(Player, expCap, level);
			} else {
				newStats = { Experience: exp, Level: level, ExperienceCap: expCap };
				this.PlayerStats.set(Player, newStats);
				this.ExpChanged.Fire(Player, newStats.Experience);
			}
		}
	},

	GetStats(Player: Player) {
		const stats = this.PlayerStats.get(Player);
		return stats ?? { Level: 1, Experience: 0, ExperienceCap: 50 };
	},

	KnitInit() {
		this.Client.GiveExp.Connect((player) => {
			this.AddExp(player, 50);
			print(`Gave ${player.Name} 50 exp`);
		});

		Players.PlayerRemoving.Connect((player) => this.PlayerStats.delete(player));
	},
});

export default LevelService;
