import { TweenService } from "@rbxts/services";

const EffectHandlers = {
	tweenColor: (obj: GuiObject, color: Color3) => {
		const prop = "BackgroundColor3";

		const tween = TweenService.Create(
			obj,
			new TweenInfo(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0),
			{ [prop]: color },
		);
		tween.Play();
	},

	tweenImageColor: (obj: ImageButton, color: Color3) => {
		const prop = "ImageColor3";

		const tween = TweenService.Create(
			obj,
			new TweenInfo(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0),
			{ [prop]: color },
		);
		tween.Play();
	},

	tweenTransparency: (obj: GuiObject, request: string) => {
		const prop = "BackgroundTransparency";

		let tween;
		switch (request) {
			case "FadeIn":
				tween = TweenService.Create(
					obj,
					new TweenInfo(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0),
					{ [prop]: 0 },
				);
				break;
			case "FadeOut":
				tween = TweenService.Create(
					obj,
					new TweenInfo(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0),
					{ [prop]: 1 },
				);
				break;
		}

		if (tween) {
			tween.Play();
		}
	},

	tweenImageTransparency: (obj: ImageButton, request: string) => {
		const prop = "ImageTransparency";
		let tween;
		switch (request) {
			case "FadeIn":
				tween = TweenService.Create(
					obj,
					new TweenInfo(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0),
					{ [prop]: 0 },
				);
				break;
			case "FadeOut":
				tween = TweenService.Create(
					obj,
					new TweenInfo(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0),
					{ [prop]: 1 },
				);
				break;
		}

		if (tween) {
			tween.Play();
		}
	},

	tweenTextTransparency: (obj: TextLabel, request: string) => {
		const prop = "TextTransparency";
		let tween;
		switch (request) {
			case "FadeIn":
				tween = TweenService.Create(
					obj,
					new TweenInfo(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0),
					{ [prop]: 0 },
				);
				break;
			case "FadeOut":
				tween = TweenService.Create(
					obj,
					new TweenInfo(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0),
					{ [prop]: 1 },
				);
				break;
		}

		if (tween) {
			tween.Play();
		}
	},

	tweenPos: (obj: GuiObject, direction: string, magnitude: number) => {
		switch (direction) {
			case "Up":
				obj.TweenPosition(
					new UDim2(
						obj.Position.X.Scale,
						obj.Position.X.Offset,
						obj.Position.Y.Scale - magnitude,
						obj.Position.Y.Offset,
					),
					"Out",
					"Quad",
					0.3,
					false,
					undefined,
				);
				break;
			case "Down":
				obj.TweenPosition(
					new UDim2(
						obj.Position.X.Scale,
						obj.Position.X.Offset,
						obj.Position.Y.Scale + magnitude,
						obj.Position.Y.Offset,
					),
					"Out",
					"Quad",
					0.3,
					false,
					undefined,
				);
				break;
			case "Left":
				obj.TweenPosition(
					new UDim2(
						obj.Position.X.Scale - magnitude,
						obj.Position.X.Offset,
						obj.Position.Y.Scale,
						obj.Position.Y.Offset,
					),
					"Out",
					"Quad",
					0.3,
					false,
					undefined,
				);
				break;
			case "Right":
				obj.TweenPosition(
					new UDim2(
						obj.Position.X.Scale + magnitude,
						obj.Position.X.Offset,
						obj.Position.Y.Scale,
						obj.Position.Y.Offset,
					),
					"Out",
					"Quad",
					0.3,
					false,
					undefined,
				);
				break;
		}
	},
	tweenSize: (object: GuiObject, newSize: UDim2, request: string) => {
		switch (request) {
			case "enlarge":
				object.TweenSize(
					new UDim2(newSize.X.Scale, newSize.X.Offset + 10, newSize.Y.Scale, newSize.Y.Offset + 10),
					"Out",
					"Quad",
					0.2,
					false,
					undefined,
				);
				break;
			case "shrink":
				object.TweenSize(
					new UDim2(
						object.Size.X.Scale,
						object.Size.X.Offset + 10,
						object.Size.Y.Scale,
						object.Size.Y.Offset + 10,
					),
					"Out",
					"Quad",
					0.2,
					false,
					undefined,
				);
				break;
		}

		wait(0.2);
		object.TweenSize(
			new UDim2(newSize.X.Scale, newSize.X.Offset, newSize.Y.Scale, newSize.Y.Offset),
			"Out",
			"Quad",
			0.2,
			false,
			undefined,
		);
	},
};

export default EffectHandlers;
