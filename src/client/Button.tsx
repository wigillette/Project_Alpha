import Roact, { Portal } from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { TweenService } from "@rbxts/services";
import Store from "./ConfigureStore";

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
				Position={new UDim2(0.4, 0, 0.1, 0)}
				Size={new UDim2(0.2, 0, 0.1, 0)}
				BackgroundColor3={Color3.fromRGB(200, 0, 0)}
				BackgroundTransparency={0}
				Ref={textButtonRef}
				AutoButtonColor={false}
				Font={"TitilliumWeb"}
				Event={{
					MouseEnter: () => {
						const textButton = textButtonRef.getValue() as TextButton;
						const tween = TweenService.Create(
							textButton,
							new TweenInfo(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0),
							{ BackgroundColor3: Color3.fromRGB(255, 0, 0) },
						);
						tween.Play();
					},
					MouseLeave: () => {
						const textButton = textButtonRef.getValue() as TextButton;
						const tween = TweenService.Create(
							textButton,
							new TweenInfo(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0),
							{ BackgroundColor3: Color3.fromRGB(220, 0, 0) },
						);
						tween.Play();
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
