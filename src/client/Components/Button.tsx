import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import EffectsHandler from "../../shared/EffectsHandler";

interface UIProps {
	text: string;
	onClick: () => void;
}

let Button = (props: UIProps) => {
	const buttonRef = Roact.createRef<ImageButton>();
	const frameRef = Roact.createRef<Frame>();
	const onClick = props.onClick;
	const text = props.text;
	return (
		<frame
			BackgroundTransparency={1}
			Position={new UDim2(0.5, 0, 0.2, 0)}
			Size={new UDim2(0.2, 0, 0.1, 0)}
			Ref={frameRef}
			AnchorPoint={new Vector2(0.5, 0.2)}
			Event={{
				MouseEnter: () => {
					const button = buttonRef.getValue() as ImageButton;
					const frame = frameRef.getValue() as Frame;
					EffectsHandler.tweenImageColor(button, Color3.fromRGB(255, 0, 0));
					EffectsHandler.tweenSize(
						frame,
						new UDim2(
							frame.Size.X.Scale + 0.1,
							frame.Size.X.Offset,
							frame.Size.Y.Scale + 0.1,
							frame.Size.Y.Offset,
						),
						"enlarge",
					);
				},
				MouseLeave: () => {
					const button = buttonRef.getValue() as ImageButton;
					const frame = frameRef.getValue() as Frame;
					EffectsHandler.tweenImageColor(button, Color3.fromRGB(200, 0, 0));
					EffectsHandler.tweenSize(
						frame,
						new UDim2(
							frame.Size.X.Scale - 0.1,
							frame.Size.X.Offset,
							frame.Size.Y.Scale - 0.1,
							frame.Size.Y.Offset,
						),
						"enlarge",
					);
				},
			}}
		>
			<imagebutton
				Image="http://www.roblox.com/asset/?id=5295627555"
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={new UDim2(0.5, 0, 0.5, 0)}
				Size={new UDim2(1, 0, 1, 0)}
				ImageColor3={Color3.fromRGB(200, 0, 0)}
				BackgroundTransparency={1}
				ZIndex={1}
				Ref={buttonRef}
				ScaleType={Enum.ScaleType.Slice}
				SliceCenter={new Rect(10, 10, 10, 10)}
				Event={{
					MouseButton1Click: onClick,
				}}
			>
				<textlabel
					ZIndex={2}
					Text={text}
					TextScaled={true}
					Font={"TitilliumWeb"}
					BackgroundTransparency={1}
					Size={new UDim2(1, 0, 1, 0)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={new UDim2(0.5, 0, 0.5, 0)}
				/>
			</imagebutton>
			<imagelabel
				Image="http://www.roblox.com/asset/?id=5295627555"
				AnchorPoint={new Vector2(0.5, 0.5)}
				ZIndex={0}
				Position={new UDim2(0.5, 0, 0.5, 3)}
				Size={new UDim2(1, 0, 1, 0)}
				ImageColor3={Color3.fromRGB(140, 0, 0)}
				BackgroundTransparency={1}
				ScaleType={Enum.ScaleType.Slice}
				SliceCenter={new Rect(10, 10, 10, 10)}
			></imagelabel>
		</frame>
	);
};

interface NewNameState {
	newName: { text: string };
}

export default Button = RoactRodux.connect(
	function (state: NewNameState, props) {
		return {
			text: state.newName.text,
		};
	},
	function (dispatch) {
		return {
			onClick: function () {
				dispatch({
					type: "SwitchName",
				});
			},
		};
	},
)(Button);
