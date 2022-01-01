import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import EffectsHandler from "../../shared/EffectsHandler";

interface UIProps {
	name: string;
	price: number;
}

const ShopItem = (props: UIProps) => {
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
					Text={props.name}
				/>

				<textlabel
					ZIndex={3}
					Position={new UDim2(0.5, 0, 0.3, 0)}
					Size={new UDim2(1, 0, 0.15, 0)}
					AnchorPoint={new Vector2(0.5, 0.05)}
					Font={"TitilliumWeb"}
					BackgroundTransparency={1}
					TextScaled={true}
					Text={tostring(props.price)}
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
};

export default ShopItem;
