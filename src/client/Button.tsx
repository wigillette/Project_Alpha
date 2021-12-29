import Roact from "@rbxts/roact";
import { Players, TweenService } from "@rbxts/services";
const playerGui = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui;

interface UIProps {
	text: string;
}
interface UIState {
	backgroundColor: Color3;
}

class Button extends Roact.Component<UIProps, UIState> {
	textButtonRef: Roact.Ref<TextButton>;
	state = {
		backgroundColor: Color3.fromRGB(200, 0, 0),
	};

	constructor(props: UIProps) {
		super(props);
		this.textButtonRef = Roact.createRef<TextButton>();
	}

	render() {
		return (
			<screengui ResetOnSpawn={false}>
				<textbutton
					Text={this.props.text}
					TextScaled={true}
					Position={new UDim2(0.4, 0, 0.1, 0)}
					Size={new UDim2(0.2, 0, 0.1, 0)}
					BackgroundColor3={this.state.backgroundColor}
					BackgroundTransparency={0}
					Ref={this.textButtonRef}
					AutoButtonColor={false}
					Font={"TitilliumWeb"}
					Event={{
						MouseEnter: () => {
							const textButton = this.textButtonRef.getValue() as TextButton;
							const tween = TweenService.Create(
								textButton,
								new TweenInfo(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0),
								{ BackgroundColor3: Color3.fromRGB(255, 0, 0) },
							);
							tween.Play();
							wait(0.2);
							this.setState({
								backgroundColor: Color3.fromRGB(255, 0, 0),
							});
						},
						MouseLeave: () => {
							const textButton = this.textButtonRef.getValue() as TextButton;
							const tween = TweenService.Create(
								textButton,
								new TweenInfo(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0),
								{ BackgroundColor3: Color3.fromRGB(220, 0, 0) },
							);
							tween.Play();
							wait(0.2);
							this.setState({
								backgroundColor: Color3.fromRGB(220, 0, 0),
							});
						},
					}}
				/>
			</screengui>
		);
	}

	didMount() {
		const textButton = this.textButtonRef.getValue() as TextButton;
		print(textButton);
		textButton.GetPropertyChangedSignal("BackgroundColor3").Connect(() => {
			print(`The new background color is: ${textButton.BackgroundColor3}`);
		});
	}
}

Roact.mount(<Button text="Hello world" />, playerGui, "Button");