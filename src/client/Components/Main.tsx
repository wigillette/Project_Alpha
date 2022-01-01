import Roact from "@rbxts/roact";
import ProfileBar from "./ProfileBar";
import GoldContainer from "./GoldContainer";
import Shop from "./Shop";

const Main = () => {
	return (
		<screengui ResetOnSpawn={false}>
			<GoldContainer />
			<ProfileBar />
			<Shop />
		</screengui>
	);
};

export default Main;
