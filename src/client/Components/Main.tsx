import Roact from "@rbxts/roact";
import Button from "./Button";
import ProfileBar from "./ProfileBar";

const Main = () => {
	return (
		<screengui ResetOnSpawn={false}>
			<Button />
			<ProfileBar />
		</screengui>
	);
};

export default Main;
