import Rodux from "@rbxts/rodux";
import buttonReducer from "./ButtonReducer";
import profileReducer from "./ProfileReducer";

const reducer = Rodux.combineReducers({
	newName: buttonReducer,
	updateProfile: profileReducer,
});

export default reducer;
