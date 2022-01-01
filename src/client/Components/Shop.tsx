import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import ShopItem from "./ShopItem";

interface UIProps {
	Opened: boolean;
}

const shopRef = Roact.createRef<Frame>();
const gridRef = Roact.createRef<ScrollingFrame>();
class Shop extends Roact.Component<UIProps> {
	render() {
		return (
			<frame
				Ref={shopRef}
				Size={new UDim2(0.4, 0, 0.6, 0)}
				AnchorPoint={new Vector2(0.5, 0.4)}
				Position={this.props.Opened ? new UDim2(0.5, 0, 0.4, 0) : new UDim2(0.5, 0, -1, 0)}
				BackgroundTransparency={1}
			>
				<imagelabel
					ZIndex={1}
					Size={new UDim2(1, 0, 1, 0)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={new UDim2(0.5, 0, 0.5, 0)}
					Image="http://www.roblox.com/asset/?id=5295627555"
					ImageColor3={Color3.fromRGB(247, 247, 247)}
					ScaleType={Enum.ScaleType.Slice}
					BackgroundTransparency={1}
					SliceCenter={new Rect(10, 10, 10, 10)}
				>
					<textlabel
						ZIndex={2}
						Position={new UDim2(0.5, 0, 0.01, 0)}
						Size={new UDim2(1, 0, 0.1, 0)}
						AnchorPoint={new Vector2(0.5, 0.025)}
						Font={"TitilliumWeb"}
						BackgroundTransparency={1}
						TextScaled={true}
						Text={"Shop"}
					/>
					<scrollingframe
						Position={new UDim2(0.5, 0, 0.6, 0)}
						AnchorPoint={new Vector2(0.5, 0.6)}
						BackgroundTransparency={1}
						Ref={gridRef}
						BorderSizePixel={0}
						Size={new UDim2(0.9, 0, 0.75, 0)}
					>
						<uigridlayout
							CellSize={new UDim2(0, 150, 0, 150)}
							CellPadding={new UDim2(0, 10, 0, 10)}
							HorizontalAlignment={"Left"}
							SortOrder={"LayoutOrder"}
							StartCorner={"TopLeft"}
						/>
					</scrollingframe>
				</imagelabel>
				<imagelabel
					Image="http://www.roblox.com/asset/?id=5295627555"
					AnchorPoint={new Vector2(0.5, 0.5)}
					ZIndex={0}
					Position={new UDim2(0.5, 0, 0.5, 3)}
					Size={new UDim2(1, 0, 1, 0)}
					ImageColor3={Color3.fromRGB(180, 180, 180)}
					BackgroundTransparency={1}
					ScaleType={Enum.ScaleType.Slice}
					SliceCenter={new Rect(10, 10, 10, 10)}
				></imagelabel>
			</frame>
		);
	}

	componentDidMount() {}
}

interface ShopState {
	toggleShop: { open: boolean };
}
export = RoactRodux.connect(function (state: ShopState, props) {
	const shopFrame = shopRef.getValue() as Frame;
	if (shopFrame) {
		state.toggleShop.open
			? shopFrame.TweenPosition(new UDim2(0.5, 0, 0.4, 0), "Out", "Quad", 0.2, true, undefined)
			: shopFrame.TweenPosition(new UDim2(0.5, 0, -1, 0), "Out", "Quad", 0.2, true, undefined);
	}

	return {
		Opened: state.toggleShop.open,
	};
})(Shop);