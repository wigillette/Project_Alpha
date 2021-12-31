import { KnitServer as Knit } from "@rbxts/knit";
import { ServerScriptService } from "@rbxts/services";
import LevelService from "./Services/LevelService";
import { Players } from "@rbxts/services";
Knit.AddServices(ServerScriptService.WaitForChild("TS").WaitForChild("Services"));
Knit.Start();
wait(3);
LevelService.AddExp(Players.GetPlayers()[0], 200);
