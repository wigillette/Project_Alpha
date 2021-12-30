import Rodux from "@rbxts/rodux";

interface profileState {
	Level: number;
	ExperienceCap: number;
	Experience: number;
}

interface Action<T = string, L = number, E = number, EC = number> {
	type: T;
	level: L;
	experience: E;
	experienceCap: EC;
}

const profileReducer = Rodux.createReducer(
	{ Level: 1, Experience: 0, ExperienceCap: 50 },
	{
		UpdateProfile: (
			state: { Level: number; Experience: number; ExperienceCap: number },
			action: Action<string, number, number, number>,
		) => {
			const newState: profileState = {
				Level: action.level,
				Experience: action.experience,
				ExperienceCap: action.experienceCap,
			};

			return newState;
		},
	},
);

export default profileReducer;
