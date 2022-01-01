import Roact from "@rbxts/roact";
import EffectsHandler from "../../shared/EffectsHandler";

interface UIProps {
	zIndex: number;
	text: string;
	position: UDim2;
	size: UDim2;
	anchorPoint: Vector2;
	color: Color3;
	hoverColor: Color3;
	shadowColor: Color3;
	onClick: () => void;
}

const Button = (props: UIProps) => {
	const buttonRef = Roact.createRef<ImageButton>();
	const onClick = props.onClick;
	const text = props.text;
	return (
		<frame
			BackgroundTransparency={1}
			Position={props.position}
			Size={props.size}
			ZIndex={props.zIndex}
			AnchorPoint={props.anchorPoint}
			Event={{
				MouseEnter: () => {
					const button = buttonRef.getValue() as ImageButton;
					EffectsHandler.tweenImageColor(button, props.hoverColor);
				},
				MouseLeave: () => {
					const button = buttonRef.getValue() as ImageButton;
					EffectsHandler.tweenImageColor(button, props.color);
				},
			}}
		>
			<uiaspectratioconstraint AspectRatio={1} AspectType={"ScaleWithParentSize"} DominantAxis={"Height"} />
			<imagebutton
				Image="http://www.roblox.com/asset/?id=5350360532"
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={new UDim2(0.5, 0, 0.5, 0)}
				Size={new UDim2(1, 0, 1, 0)}
				ImageColor3={props.color}
				BackgroundTransparency={1}
				ZIndex={2}
				Ref={buttonRef}
				ScaleType={Enum.ScaleType.Slice}
				SliceCenter={new Rect(350, 350, 350, 350)}
				Event={{
					MouseButton1Click: onClick,
				}}
			>
				<textlabel
					ZIndex={2}
					Text={text}
					TextScaled={true}
					Font={"TitilliumWeb"}
					BackgroundTransparency={1}
					Size={new UDim2(1, 0, 1, 0)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={new UDim2(0.5, 0, 0.5, 0)}
				/>
			</imagebutton>
			<imagelabel
				Image="http://www.roblox.com/asset/?id=5350360532"
				AnchorPoint={new Vector2(0.5, 0.5)}
				ZIndex={1}
				Position={new UDim2(0.5, 0, 0.5, 3)}
				Size={new UDim2(1, 0, 1, 0)}
				ImageColor3={props.shadowColor}
				BackgroundTransparency={1}
				ScaleType={Enum.ScaleType.Slice}
				SliceCenter={new Rect(350, 350, 350, 350)}
			></imagelabel>
		</frame>
	);
};

export default Button;
