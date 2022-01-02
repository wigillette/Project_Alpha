import Rodux from "@rbxts/rodux";
import LevelSettings from "../../../shared/LevelSettings";

interface profileState {
	Level: number;
	ExperienceCap: number;
	Experience: number;
}

interface Action {
	type: string;
	payload?: { Level: number; Experience: number; ExperienceCap: number };
}

const profileReducer = Rodux.createReducer(LevelSettings.InitialProfile, {
	updateProfile: (state: profileState, action: Action) => {
		let newState: profileState = LevelSettings.InitialProfile;
		if (action.payload) {
			newState = {
				Level: action.payload.Level,
				Experience: action.payload.Experience,
				ExperienceCap: action.payload.ExperienceCap,
			};
		}
		print("Fetched Profile Stats Store Update Successful | Client");
		print(newState);
		return newState;
	},
});

export default profileReducer;
