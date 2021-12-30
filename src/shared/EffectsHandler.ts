import { TweenService } from "@rbxts/services";

const EffectHandlers = {
	tweenColor: (object: GuiObject, color: Color3) => {
		const tween = TweenService.Create(
			object,
			new TweenInfo(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0),
			{ BackgroundColor3: color },
		);
		tween.Play();
	},
};
export default EffectHandlers;
