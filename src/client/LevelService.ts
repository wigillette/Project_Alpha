import { KnitClient as Knit } from "@rbxts/knit";
import Store from "./ConfigureStore";
const LevelService = Knit.GetService("LevelService");

function StatsChanged(Level: number, ExperienceCap: number, Experience: number) {
	// TO-DO: Dispatch fetched stats to Rodux store
	print("Dispatching profile update");
	Store.dispatch({
		type: "updateProfile",
		payload: { Level: Level, Experience: Experience, ExperienceCap: ExperienceCap },
	});
}

const initialStats = LevelService.GetStats();
StatsChanged(initialStats.Level, initialStats.ExperienceCap, initialStats.Experience);
LevelService.StatsChanged.Connect(StatsChanged);
