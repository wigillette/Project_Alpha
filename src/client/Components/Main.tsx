import Roact from "@rbxts/roact";
import ProfileBar from "./ProfileBar";
import GoldContainer from "./GoldContainer";
import Shop from "./Shop";
import Inventory from "./Inventory";

const Main = () => {
	return (
		<screengui ResetOnSpawn={false}>
			<GoldContainer />
			<ProfileBar />
			<Shop />
			<Inventory />
		</screengui>
	);
};

export default Main;
