import { KnitClient as Knit } from "@rbxts/knit";
import Store from "../Rodux/ConfigureStore";
const GoldService = Knit.GetService("GoldService");

const GoldClient = {
	GoldChanged: (Gold: number) => {
		// TO-DO: Dispatch fetched Gold to Rodux store
		print(`Updating to Gold = ${Gold}`);
		Store.dispatch({
			type: "updateGold",
			payload: { Gold: Gold },
		});
	},
	init: () => {
		const initialGold = GoldService.GetGold();
		GoldClient.GoldChanged(initialGold);
		GoldService.GoldChanged.Connect(GoldClient.GoldChanged);
		print("Gold Service Initialized | Client");
	},
};

export default GoldClient;
