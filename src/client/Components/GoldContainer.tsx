import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import EffectsHandler from "../../shared/EffectsHandler";
import Button from "./CircularButton";

interface UIProps {
	Gold: number;
	onClick: () => void;
}
let GoldContainer = (props: UIProps) => {
	const frameRef = Roact.createRef<Frame>();
	return (
		<frame
			Ref={frameRef}
			Size={new UDim2(0.1, 0, 0.05, 0)}
			AnchorPoint={new Vector2(0.05, 0.8)}
			Position={new UDim2(0.01, 0, 0.8, 0)}
			BackgroundTransparency={1}
		>
			<uiaspectratioconstraint AspectRatio={5} AspectType={"ScaleWithParentSize"} DominantAxis={"Height"} />
			<imagelabel
				ZIndex={1}
				Size={new UDim2(1, 0, 1, 0)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={new UDim2(0.5, 0, 0.5, 0)}
				Image="http://www.roblox.com/asset/?id=5350360532"
				ImageColor3={Color3.fromRGB(247, 247, 247)}
				ScaleType={Enum.ScaleType.Slice}
				BackgroundTransparency={1}
				SliceCenter={new Rect(350, 350, 350, 350)}
			>
				<textlabel
					ZIndex={2}
					TextScaled={true}
					Font={"TitilliumWeb"}
					Size={new UDim2(0.5, 0, 0.8, 0)}
					AnchorPoint={new Vector2(0.2, 0.5)}
					Position={new UDim2(0.2, 0, 0.5, 0)}
					BackgroundTransparency={1}
					Text={`Gold: ${props.Gold}`}
				/>
				<Button
					zIndex={3}
					text="+"
					position={new UDim2(0.8, 0, 0.5, 0)}
					size={new UDim2(0.2, 0, 0.8, 0)}
					onClick={props.onClick}
					anchorPoint={new Vector2(0.8, 0.5)}
					color={Color3.fromRGB(255, 255, 255)}
					hoverColor={Color3.fromRGB(220, 220, 220)}
					shadowColor={Color3.fromRGB(200, 200, 200)}
				/>
			</imagelabel>
			<imagelabel
				Image="http://www.roblox.com/asset/?id=5350360532"
				AnchorPoint={new Vector2(0.5, 0.5)}
				ZIndex={0}
				Position={new UDim2(0.5, 0, 0.5, 3)}
				Size={new UDim2(1, 0, 1, 0)}
				ImageColor3={Color3.fromRGB(180, 180, 180)}
				BackgroundTransparency={1}
				ScaleType={Enum.ScaleType.Slice}
				SliceCenter={new Rect(350, 350, 350, 350)}
			></imagelabel>
		</frame>
	);
};

interface NewStatsState {
	updateGold: { Gold: number };
}
export default GoldContainer = RoactRodux.connect(
	function (state: NewStatsState, props) {
		return {
			Gold: state.updateGold.Gold,
		};
	},
	(dispatch) => {
		return {
			onClick: () => {
				dispatch({
					type: "toggleShop",
				});
			},
		};
	},
)(GoldContainer);
