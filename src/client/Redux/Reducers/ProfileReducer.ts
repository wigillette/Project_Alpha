import Rodux from "@rbxts/rodux";

interface profileState {
	Level: number;
	ExperienceCap: number;
	Experience: number;
}

interface Action<S = string, T = {}> {
	type: string;
	payload?: { Level: number; Experience: number; ExperienceCap: number };
}

const profileReducer = Rodux.createReducer(
	{ Level: 1, Experience: 0, ExperienceCap: 50 },
	{
		updateProfile: (state: profileState, action: Action<string, {}>) => {
			let newState: profileState = { Level: 1, Experience: 0, ExperienceCap: 50 };
			if (action.payload) {
				newState = {
					Level: action.payload.Level,
					Experience: action.payload.Experience,
					ExperienceCap: action.payload.ExperienceCap,
				};
			}

			print(newState);
			return newState;
		},
	},
);

export default profileReducer;
