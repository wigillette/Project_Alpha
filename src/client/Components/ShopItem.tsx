import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import EffectsHandler from "../../shared/EffectsHandler";
import RectButton from "./RectButton";
import Store from "../Rodux/ConfigureStore";
import { DispatchParam } from "@rbxts/rodux";
import ShopService from "../Services/ShopService";

interface UIProps {
	name: string;
	category: string;
	price: number;
	onPurchase: (itemName: string, category: string) => void;
}

class ShopItem extends Roact.Component<UIProps> {
	buttonRef = Roact.createRef<ImageButton>();

	purchaseItem() {
		const itemName = this.props.name;
		const category = this.props.category;
		this.props.onPurchase(itemName, category);
	}

	render() {
		return (
			<frame
				Size={new UDim2(0.4, 0, 0.6, 0)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={new UDim2(0.5, 0, 0.5, 0)}
				BackgroundTransparency={1}
			>
				<imagelabel
					ZIndex={2}
					Size={new UDim2(1, 0, 1, 0)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={new UDim2(0.5, 0, 0.5, 0)}
					Image="http://www.roblox.com/asset/?id=5295627555"
					ImageColor3={Color3.fromRGB(255, 255, 255)}
					ScaleType={Enum.ScaleType.Slice}
					BackgroundTransparency={1}
					SliceCenter={new Rect(10, 10, 10, 10)}
				>
					<textlabel
						ZIndex={3}
						Position={new UDim2(0.5, 0, 0.05, 0)}
						Size={new UDim2(1, 0, 0.15, 0)}
						AnchorPoint={new Vector2(0.5, 0.05)}
						Font={"TitilliumWeb"}
						BackgroundTransparency={1}
						TextScaled={true}
						Text={this.props.name}
					/>
					<frame
						BackgroundTransparency={1}
						Position={new UDim2(0.5, 0, 0.8, 0)}
						Size={new UDim2(0.8, 0, 0.2, 0)}
						ZIndex={4}
						AnchorPoint={new Vector2(0.5, 0.8)}
						Event={{
							MouseEnter: () => {
								const button = this.buttonRef.getValue() as ImageButton;
								EffectsHandler.tweenImageColor(button, Color3.fromRGB(115, 191, 212));
							},
							MouseLeave: () => {
								const button = this.buttonRef.getValue() as ImageButton;
								EffectsHandler.tweenImageColor(button, Color3.fromRGB(84, 130, 143));
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
							ImageColor3={Color3.fromRGB(84, 130, 143)}
							BackgroundTransparency={1}
							ZIndex={4}
							Ref={this.buttonRef}
							ScaleType={Enum.ScaleType.Slice}
							SliceCenter={new Rect(10, 10, 10, 10)}
							Event={{
								MouseButton1Click: () => this.purchaseItem(),
							}}
						>
							<textlabel
								ZIndex={5}
								Text={tostring(this.props.price)}
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
							ImageColor3={Color3.fromRGB(43, 51, 54)}
							BackgroundTransparency={1}
							ScaleType={Enum.ScaleType.Slice}
							SliceCenter={new Rect(10, 10, 10, 10)}
						></imagelabel>
					</frame>
				</imagelabel>
				<imagelabel
					Image="http://www.roblox.com/asset/?id=5295627555"
					AnchorPoint={new Vector2(0.5, 0.5)}
					ZIndex={1}
					Position={new UDim2(0.5, 0, 0.5, 3)}
					Size={new UDim2(1, 0, 1, 0)}
					ImageColor3={Color3.fromRGB(220, 220, 220)}
					BackgroundTransparency={1}
					ScaleType={Enum.ScaleType.Slice}
					SliceCenter={new Rect(10, 10, 10, 10)}
				></imagelabel>
				<uiaspectratioconstraint AspectRatio={1} AspectType={"ScaleWithParentSize"} DominantAxis={"Height"} />
			</frame>
		);
	}
}

export = RoactRodux.connect(undefined, (dispatch: DispatchParam<typeof Store>) => {
	return {
		onPurchase: (itemName: string, category: string) => {
			dispatch(() => {
				ShopService.PurchaseItem(itemName, category);
			});
		},
	};
})(ShopItem);
