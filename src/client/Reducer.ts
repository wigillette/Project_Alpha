import Rodux from "@rbxts/rodux";

interface buttonState {
	text: string;
}

interface Action<T = string> {
	type: T;
}

const buttonReducer = Rodux.createReducer(
	{ text: "Kate Kane" },
	{
		SwitchName: (state: { text: string }, action: Action<string>) => {
			const newState: buttonState = { text: "" };
			newState.text = state.text === "Kate Kane" ? "Ryan Wilder" : "Kate Kane";
			return newState;
		},
	},
);

const reducer = Rodux.combineReducers({
	newName: buttonReducer,
});

export default reducer;
