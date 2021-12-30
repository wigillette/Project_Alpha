import { KnitClient as Knit } from "@rbxts/knit";

const LevelService = Knit.GetService("LevelService");

function StatsChanged(Level: number, ExperienceCap: number, Experience: number) {
	// TO-DO: Call Rodux action to update user profile state
}

const initialStats = LevelService.GetStats();
StatsChanged(initialStats.Level, initialStats.ExperienceCap, initialStats.Experience);
LevelService.StatsChanged.Connect(StatsChanged);
