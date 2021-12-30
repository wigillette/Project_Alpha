import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import Main from "./Main";
import Store from "./ConfigureStore";
import { Players } from "@rbxts/services";

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
