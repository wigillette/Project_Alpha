import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import EffectsHandler from "../../shared/EffectsHandler";
import Store from "../Rodux/ConfigureStore";
import { DispatchParam } from "@rbxts/rodux";
import InventoryService from "../Services/InventoryService";
import { ObjectViewport } from "./ObjectViewport";
import { ReplicatedStorage } from "@rbxts/services";

interface UIProps {
	name: string;
	category: string;
	onEquip: (itemName: string, category: string) => void;
	equippedItems: { Weapons: string; Assets: string };
}
const assetsFolder = ReplicatedStorage.FindFirstChild("Assets");
const weaponsFolder = ReplicatedStorage.FindFirstChild("Weapons");

class InventoryItem extends Roact.Component<UIProps> {
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

			print(this.object.Name);
		}
	}

	equipItem() {
		if (
			this.props.name !== this.props.equippedItems[this.props.category as keyof typeof this.props.equippedItems]
		) {
			const itemName = this.props.name;
			const category = this.props.category;
			this.props.onEquip(itemName, category);
		}
	}

	render() {
		return (
			<frame
				Size={new UDim2(0.4, 0, 0.6, 0)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={new UDim2(0.5, 0, 0.5, 0)}
				BackgroundTransparency={1}
				ZIndex={5}
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
								if (
									this.props.equippedItems[
										this.props.category as keyof typeof this.props.equippedItems
									] !== this.props.name
								) {
									const button = this.buttonRef.getValue() as ImageButton;
									EffectsHandler.tweenImageColor(button, Color3.fromRGB(115, 191, 212));
								}
							},
							MouseLeave: () => {
								if (
									this.props.equippedItems[
										this.props.category as keyof typeof this.props.equippedItems
									] !== this.props.name
								) {
									const button = this.buttonRef.getValue() as ImageButton;
									EffectsHandler.tweenImageColor(button, Color3.fromRGB(84, 130, 143));
								}
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
							ImageColor3={
								this.props.equippedItems[
									this.props.category as keyof typeof this.props.equippedItems
								] === this.props.name
									? Color3.fromRGB(51, 87, 97)
									: Color3.fromRGB(84, 130, 143)
							}
							BackgroundTransparency={1}
							ZIndex={4}
							Ref={this.buttonRef}
							ScaleType={Enum.ScaleType.Slice}
							SliceCenter={new Rect(10, 10, 10, 10)}
							Event={{
								MouseButton1Click: () => {
									this.equipItem();
								},
							}}
						>
							<textlabel
								ZIndex={5}
								Text={
									this.props.equippedItems[
										this.props.category as keyof typeof this.props.equippedItems
									] === this.props.name
										? "Equipped"
										: "Equip"
								}
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
							ImageColor3={
								this.props.equippedItems[
									this.props.category as keyof typeof this.props.equippedItems
								] === this.props.name
									? Color3.fromRGB(20, 25, 27)
									: Color3.fromRGB(43, 51, 54)
							}
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
interface InventoryItemState {
	equipItem: {
		toggle: boolean;
		currentTab: string;
		inventory: { Assets: string[]; Weapons: string[] };
		equippedItems: { Weapons: string; Assets: string };
	};
}
export = RoactRodux.connect(
	function (state: InventoryItemState, props) {
		return {
			equippedItems: state.equipItem.equippedItems,
		};
	},
	(dispatch: DispatchParam<typeof Store>) => {
		return {
			onEquip: (itemName: string, category: string) => {
				dispatch(() => {
					InventoryService.EquipItem(itemName, category);
				});
			},
		};
	},
)(InventoryItem);
