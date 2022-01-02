import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import EffectsHandler from "../../shared/EffectsHandler";

interface UIProps {
	text: string;
	onClick: (tabName: string) => void;
}

class inventoryTab extends Roact.Component<UIProps> {
	buttonRef;
	switchTab() {
		const tabName = this.props.text;
		this.props.onClick(tabName);
	}

	constructor(props: UIProps) {
		super(props);
		this.buttonRef = Roact.createRef<ImageButton>();
	}

	render() {
		return (
			<frame Size={new UDim2(0.2, 0, 0.7, 0)} BackgroundTransparency={1} ZIndex={3}>
				<imagebutton
					Size={new UDim2(1, 0, 1, 0)}
					ZIndex={4}
					Ref={this.buttonRef}
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={new UDim2(0.5, 0, 0.5, 0)}
					Image="http://www.roblox.com/asset/?id=5295627555"
					ImageColor3={Color3.fromRGB(240, 240, 240)}
					ScaleType={Enum.ScaleType.Slice}
					BackgroundTransparency={1}
					SliceCenter={new Rect(10, 10, 10, 10)}
					Event={{
						MouseButton1Click: () => {
							this.switchTab();
						},
						MouseEnter: () => {
							const button = this.buttonRef.getValue() as ImageButton;
							EffectsHandler.tweenImageColor(button, Color3.fromRGB(255, 255, 255));
						},
						MouseLeave: () => {
							const button = this.buttonRef.getValue() as ImageButton;
							EffectsHandler.tweenImageColor(button, Color3.fromRGB(245, 245, 245));
						},
					}}
				>
					<textlabel
						ZIndex={5}
						Text={this.props.text}
						TextScaled={true}
						Font={"TitilliumWeb"}
						BackgroundTransparency={1}
						Size={new UDim2(1, 0, 1, 0)}
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={new UDim2(0.5, 0, 0.5, 0)}
					></textlabel>
				</imagebutton>
				<imagelabel
					ZIndex={3}
					Size={new UDim2(1, 0, 1, 0)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={new UDim2(0.5, 0, 0.5, 3)}
					Image="http://www.roblox.com/asset/?id=5295627555"
					ImageColor3={Color3.fromRGB(240, 240, 240)}
					ScaleType={Enum.ScaleType.Slice}
					BackgroundTransparency={1}
					SliceCenter={new Rect(10, 10, 10, 10)}
				></imagelabel>
			</frame>
		);
	}
}

export = RoactRodux.connect(undefined, (dispatch) => {
	return {
		onClick: (tabName: string) => {
			dispatch({
				type: "changeTab",
				tab: tabName,
			});
		},
	};
})(inventoryTab);
