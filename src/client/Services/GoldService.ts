import { KnitClient as Knit } from "@rbxts/knit";
import Store from "../Rodux/ConfigureStore";
const GoldService = Knit.GetService("GoldService");

const GoldClient = {
	GoldChanged: (Gold: number) => {
		print("Dispatching updated gold to Store.. | Client");
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
