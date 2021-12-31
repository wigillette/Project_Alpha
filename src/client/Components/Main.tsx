import Roact from "@rbxts/roact";
import Button from "./Button";
import ProfileBar from "./ProfileBar";

const Main = () => {
	return (
		<screengui ResetOnSpawn={false}>
			<Button />
			<ProfileBar Experience={50} ExperienceCap={150} Level={5} />
		</screengui>
	);
};

export default Main;
