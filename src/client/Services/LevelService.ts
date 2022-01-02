import { KnitClient as Knit } from "@rbxts/knit";
import Store from "../Rodux/ConfigureStore";
const LevelService = Knit.GetService("LevelService");

const LevelClient = {
	StatsChanged: (Level: number, ExperienceCap: number, Experience: number) => {
		print("Dispatching updated profile stats to Store.. | Client");
		Store.dispatch({
			type: "updateProfile",
			payload: { Level: Level, Experience: Experience, ExperienceCap: ExperienceCap },
		});
	},
	init: () => {
		const initialStats = LevelService.GetStats();
		LevelClient.StatsChanged(initialStats.Level, initialStats.ExperienceCap, initialStats.Experience);
		LevelService.StatsChanged.Connect(LevelClient.StatsChanged);
		print("Level Service Initialized | Client");
	},
};

export default LevelClient;
