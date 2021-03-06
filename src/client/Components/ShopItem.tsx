import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import EffectsHandler from "../../shared/EffectsHandler";
import { ObjectViewport } from "./ObjectViewport";
import Store from "../Rodux/ConfigureStore";
import { DispatchParam } from "@rbxts/rodux";
import ShopService from "../Services/ShopService";
import { ReplicatedStorage } from "@rbxts/services";

interface UIProps {
	name: string;
	category: string;
	price: number;
	response: { itemName: string; feedback: string };
	onPurchase: (itemName: string, category: string) => void;
}
const assetsFolder = ReplicatedStorage.FindFirstChild("Assets");
const weaponsFolder = ReplicatedStorage.FindFirstChild("Weapons");

class ShopItem extends Roact.Component<UIProps> {
	buttonRef;
	cameraRef;
	object: Model = new Instance("Model");

	constructor(props: UIProps) {
		super(props);

		this.buttonRef = Roact.createRef<ImageButton>();
		this.cameraRef = Roact.createRef<Camera>();
		if (assetsFolder && weaponsFolder) {
			this.object =
				(assetsFolder.FindFirstChild(this.props.name) as Model) ||
				(weaponsFolder.FindFirstChild(this.props.name) as Model);
		}
	}

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
					<ObjectViewport
						nativeProps={{
							ZIndex: 3,
							Position: new UDim2(0.5, 0, 0.45, 0),
							Size: new UDim2(0.3, 0, 0.3, 0),
							BackgroundTransparency: 1,
							AnchorPoint: new Vector2(0.5, 0.6),
						}}
						instance={this.object.Clone() as Model}
					>
						<uiaspectratioconstraint
							AspectRatio={1}
							AspectType={"ScaleWithParentSize"}
							DominantAxis={"Height"}
						/>
					</ObjectViewport>
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
					<textlabel
						ZIndex={5}
						Text={this.props.response.itemName === this.props.name ? this.props.response.feedback : ""}
						TextScaled={true}
						Font={"TitilliumWeb"}
						BackgroundTransparency={1}
						Size={new UDim2(1, 0, 0.15, 0)}
						AnchorPoint={new Vector2(0.5, 0.98)}
						Position={new UDim2(0.5, 0, 0.98, 0)}
					/>
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
interface ItemState {
	purchaseItem: { response: { itemName: string; feedback: string } };
}
export = RoactRodux.connect(
	function (state: ItemState, props) {
		return {
			response: state.purchaseItem.response,
		};
	},
	(dispatch: DispatchParam<typeof Store>) => {
		return {
			onPurchase: (itemName: string, category: string) => {
				dispatch(() => {
					ShopService.PurchaseItem(itemName, category);
				});
			},
		};
	},
)(ShopItem);
