import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import EffectsHandler from "shared/EffectsHandler";
import InventoryItem from "./InventoryItem";
import ObjectUtils from "@rbxts/object-utils";
import InventoryTab from "./InventoryTab";

interface UIProps {
	toggle: boolean;
	currentTab: string;
	inventory: { Assets: string[]; Weapons: string[] };
	onToggle: () => void;
}

const inventoryRef = Roact.createRef<Frame>();
const buttonRef = Roact.createRef<ImageButton>();
const gridRef = Roact.createRef<ScrollingFrame>();
class Inventory extends Roact.Component<UIProps> {
	render() {
		return (
			<frame
				BackgroundTransparency={1}
				Size={new UDim2(1, 0, 1, 0)}
				Position={new UDim2(0.5, 0, 0.5, 0)}
				AnchorPoint={new Vector2(0.5, 0.5)}
			>
				<frame
					BackgroundTransparency={1}
					Position={new UDim2(0.01, 0, 0.5, 0)}
					Size={new UDim2(0.2, 0, 0.05, 0)}
					ZIndex={3}
					AnchorPoint={new Vector2(0.01, 0.5)}
					Event={{
						MouseEnter: () => {
							const button = buttonRef.getValue() as ImageButton;
							EffectsHandler.tweenImageColor(button, Color3.fromRGB(0, 255, 0));
						},
						MouseLeave: () => {
							const button = buttonRef.getValue() as ImageButton;
							EffectsHandler.tweenImageColor(button, Color3.fromRGB(0, 200, 0));
						},
					}}
				>
					<uiaspectratioconstraint
						AspectRatio={4}
						AspectType={"ScaleWithParentSize"}
						DominantAxis={"Height"}
					/>
					<imagebutton
						Image="http://www.roblox.com/asset/?id=5295627555"
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={new UDim2(0.5, 0, 0.5, 0)}
						Size={new UDim2(1, 0, 1, 0)}
						ImageColor3={Color3.fromRGB(0, 200, 0)}
						BackgroundTransparency={1}
						ZIndex={4}
						Ref={buttonRef}
						ScaleType={Enum.ScaleType.Slice}
						SliceCenter={new Rect(10, 10, 10, 10)}
						Event={{
							MouseButton1Click: this.props.onToggle,
						}}
					>
						<textlabel
							ZIndex={5}
							Text={"Inventory"}
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
						ZIndex={3}
						Position={new UDim2(0.5, 0, 0.5, 3)}
						Size={new UDim2(1, 0, 1, 0)}
						ImageColor3={Color3.fromRGB(0, 120, 0)}
						BackgroundTransparency={1}
						ScaleType={Enum.ScaleType.Slice}
						SliceCenter={new Rect(10, 10, 10, 10)}
					></imagelabel>
				</frame>
				<frame
					Ref={inventoryRef}
					Size={new UDim2(0.4, 0, 0.6, 0)}
					AnchorPoint={new Vector2(0.5, 0.4)}
					Position={this.props.toggle ? new UDim2(0.5, 0, 0.4, 0) : new UDim2(0.5, 0, -1, 0)}
					BackgroundTransparency={1}
				>
					<imagelabel
						ZIndex={3}
						Size={new UDim2(1, 0, 0.12, 0)}
						AnchorPoint={new Vector2(0.5, 0)}
						Position={new UDim2(0.5, 0, 0, 0)}
						Image="http://www.roblox.com/asset/?id=5295627555"
						ImageColor3={Color3.fromRGB(230, 230, 230)}
						ScaleType={Enum.ScaleType.Slice}
						BackgroundTransparency={1}
						SliceCenter={new Rect(10, 10, 10, 10)}
					>
						<frame
							BackgroundTransparency={1}
							Size={new UDim2(1, 0, 1, 0)}
							Position={new UDim2(0.5, 0, 0.5, 0)}
							AnchorPoint={new Vector2(0.5, 0.5)}
						>
							<uilistlayout
								Padding={new UDim(0.05, 0)}
								FillDirection={"Horizontal"}
								VerticalAlignment={"Center"}
								HorizontalAlignment={"Center"}
							/>

							<InventoryTab text="Assets" />
							<InventoryTab text="Weapons" />
						</frame>
					</imagelabel>
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
							{ObjectUtils.entries(
								this.props.inventory[this.props.currentTab as keyof typeof this.props.inventory],
							).map((item) => {
								return <InventoryItem name={item[1]} category={this.props.currentTab} />;
							})}
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
			</frame>
		);
	}
}

interface InventoryState {
	toggleInventory: { toggle: boolean; currentTab: string; inventory: { Assets: string[]; Weapons: string[] } };
	updateInventory: { toggle: boolean; currentTab: string; inventory: { Assets: string[]; Weapons: string[] } };
	changeTab: { toggle: boolean; currentTab: string; inventory: { Assets: string[]; Weapons: string[] } };
}
export = RoactRodux.connect(
	function (state: InventoryState, props) {
		const inventoryFrame = inventoryRef.getValue() as Frame;
		if (inventoryFrame) {
			state.toggleInventory.toggle
				? inventoryFrame.TweenPosition(new UDim2(0.5, 0, 0.4, 0), "Out", "Quad", 0.2, true, undefined)
				: inventoryFrame.TweenPosition(new UDim2(0.5, 0, -1, 0), "Out", "Quad", 0.2, true, undefined);
		}

		return {
			toggle: state.toggleInventory.toggle,
			inventory: state.updateInventory.inventory,
			currentTab: state.changeTab.currentTab,
		};
	},
	(dispatch) => {
		return {
			onToggle: () => {
				dispatch({
					type: "toggleInventory",
				});
			},
		};
	},
)(Inventory);
