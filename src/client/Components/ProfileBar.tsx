import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import EffectsHandler from "../../shared/EffectsHandler";

interface UIProps {
	Experience: number;
	Level: number;
	ExperienceCap: number;
}

let ProfileBar = (props: UIProps) => {
	return (
		<frame
			Size={new UDim2(1, 0, 0.1, 0)}
			AnchorPoint={new Vector2(0.5, 1)}
			Position={new UDim2(0.5, 0, 1, 0)}
			BackgroundTransparency={1}
		>
			<imagelabel
				ZIndex={1}
				Size={new UDim2(1, 0, 1, 0)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={new UDim2(0.5, 0, 0.5, 0)}
				Image="http://www.roblox.com/asset/?id=5295627555"
				ImageColor3={Color3.fromRGB(200, 0, 0)}
				ScaleType={Enum.ScaleType.Slice}
				BackgroundTransparency={1}
				SliceCenter={new Rect(10, 10, 10, 10)}
			>
				<textlabel
					TextScaled={true}
					Font={"TitilliumWeb"}
					Size={new UDim2(0.2, 0, 0.8, 0)}
					AnchorPoint={new Vector2(0.2, 0.5)}
					Position={new UDim2(0.2, 0, 0.5, 0)}
					BackgroundTransparency={1}
					Text={`Level: ${props.Level}`}
				></textlabel>
				<textlabel
					Font={"TitilliumWeb"}
					TextScaled={true}
					Size={new UDim2(0.2, 0, 0.8, 0)}
					AnchorPoint={new Vector2(0.8, 0.5)}
					Position={new UDim2(0.8, 0, 0.5, 0)}
					BackgroundTransparency={1}
					Text={`Progress: ${props.Experience}/${props.ExperienceCap}`}
				></textlabel>
			</imagelabel>
			<frame
				ZIndex={2}
				AnchorPoint={new Vector2(0, 1)}
				Position={new UDim2(0, 0, 1, 0)}
				BorderSizePixel={0}
				Size={new UDim2(props.Experience / props.ExperienceCap, 0, 0.1, 0)}
				BackgroundColor3={Color3.fromRGB(0, 200, 0)}
			></frame>
		</frame>
	);
};

interface NewStatsState {
	updateProfile: { Level: number; Experience: number; ExperienceCap: number };
}
export default ProfileBar = RoactRodux.connect(function (state: NewStatsState, props) {
	return {
		Level: state.updateProfile.Level,
		Experience: state.updateProfile.Experience,
		ExperienceCap: state.updateProfile.ExperienceCap,
	};
})(ProfileBar);
