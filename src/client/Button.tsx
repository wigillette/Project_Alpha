import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import EffectsHandler from "../shared/EffectsHandler";

interface UIProps {
	text: string;
	onClick: () => void;
}

let Button = (props: UIProps) => {
	const textButtonRef = Roact.createRef<TextButton>();
	const onClick = props.onClick;
	const text = props.text;
	return (
		<screengui ResetOnSpawn={false}>
			<textbutton
				Text={text}
				TextScaled={true}
				AnchorPoint={new Vector2(0.5, 0.2)}
				Position={new UDim2(0.5, 0, 0.2, 0)}
				Size={new UDim2(0.2, 0, 0.1, 0)}
				BackgroundColor3={Color3.fromRGB(200, 0, 0)}
				BackgroundTransparency={0}
				Ref={textButtonRef}
				AutoButtonColor={false}
				Font={"TitilliumWeb"}
				Event={{
					MouseEnter: () => {
						const textButton = textButtonRef.getValue() as TextButton;
						EffectsHandler.tweenColor(textButton, Color3.fromRGB(255, 0, 0));
						EffectsHandler.tweenSize(
							textButton,
							new UDim2(
								textButton.Size.X.Scale + 0.1,
								textButton.Size.X.Offset,
								textButton.Size.Y.Scale + 0.1,
								textButton.Size.Y.Offset,
							),
							"enlarge",
						);
					},
					MouseLeave: () => {
						const textButton = textButtonRef.getValue() as TextButton;
						EffectsHandler.tweenColor(textButton, Color3.fromRGB(200, 0, 0));
						EffectsHandler.tweenSize(
							textButton,
							new UDim2(
								textButton.Size.X.Scale - 0.1,
								textButton.Size.X.Offset,
								textButton.Size.Y.Scale - 0.1,
								textButton.Size.Y.Offset,
							),
							"shrink",
						);
					},
					MouseButton1Click: onClick,
				}}
			/>
		</screengui>
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
