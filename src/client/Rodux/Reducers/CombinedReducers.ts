import Rodux from "@rbxts/rodux";
import profileReducer from "./ProfileReducer";
import goldReducer from "./GoldReducer";
import shopReducer from "./ShopReducer";
import inventoryReducer from "./InventoryReducer";

const reducer = Rodux.combineReducers({
	updateProfile: profileReducer,
	updateGold: goldReducer,
	toggleShop: shopReducer,
	fetchItems: shopReducer,
	updateInventory: inventoryReducer,
	toggleInventory: inventoryReducer,
	changeTab: inventoryReducer,
	equipItem: inventoryReducer,
	purchaseItem: shopReducer,
});

export default reducer;
