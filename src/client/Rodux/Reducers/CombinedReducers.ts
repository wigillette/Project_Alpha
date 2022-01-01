import Rodux from "@rbxts/rodux";
import profileReducer from "./ProfileReducer";
import goldReducer from "./GoldReducer";
import shopReducer from "./ShopReducer";

const reducer = Rodux.combineReducers({
	updateProfile: profileReducer,
	updateGold: goldReducer,
	toggleShop: shopReducer,
	fetchItems: shopReducer,
});

export default reducer;
