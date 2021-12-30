import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import EffectsHandler from "../shared/EffectsHandler";

interface UIProps {
	text: string;
	onClick: () => void;
}

let Button = (props: UIProps) => {
	const textButtonRef = Roact.createRef<TextButton>();
	const textButton = textButtonRef.getValue() as TextButton;
	const onClick = props.onClick;
	const text = props.text;
	return (
		<screengui ResetOnSpawn={false}>
			<textbutton
				Text={text}
				TextScaled={true}
				Position={new UDim2(0.4, 0, 0.1, 0)}
				Size={new UDim2(0.2, 0, 0.1, 0)}
				BackgroundColor3={Color3.fromRGB(200, 0, 0)}
				BackgroundTransparency={0}
				Ref={textButtonRef}
				AutoButtonColor={false}
				Font={"TitilliumWeb"}
				Event={{
					MouseEnter: () => {
						EffectsHandler.tweenColor(textButton, Color3.fromRGB(255, 0, 0));
					},
					MouseLeave: () => {
						EffectsHandler.tweenColor(textButton, Color3.fromRGB(200, 0, 0));
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
