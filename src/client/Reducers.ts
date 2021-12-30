import Rodux from "@rbxts/rodux";
import buttonReducer from "./ButtonReducer";

const reducer = Rodux.combineReducers({
	newName: buttonReducer,
});

export default reducer;
