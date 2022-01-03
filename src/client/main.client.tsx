import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import Main from "./Components/Main";
import Store from "./Rodux/ConfigureStore";
import { Players } from "@rbxts/services";
import LevelService from "./Services/LevelService";
import GoldService from "./Services/GoldService";
import ShopService from "./Services/ShopService";
import InventoryService from "./Services/InventoryService";
import RegionService from "./Services/RegionService";

const playerGui = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui;

const app = Roact.createElement(
	RoactRodux.StoreProvider,
	{
		store: Store,
	},
	{
		Main: Roact.createElement(Main),
	},
);

Roact.mount(app, playerGui, "App");
LevelService.init();
GoldService.init();
InventoryService.init();
ShopService.init();
RegionService.init();
