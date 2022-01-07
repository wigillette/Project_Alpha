import Make from "@rbxts/make";
import Roact, { JsxInstanceProperties } from "@rbxts/roact";
import Hooks from "@rbxts/roact-hooks";
import { RunService } from "@rbxts/services";
import { useMountEffect } from "../../shared/UseMountEffect";

interface IProps {
	nativeProps: JsxInstanceProperties<ViewportFrame>;
	instance: BasePart | Model;
}

/*
local function setRotationEvent(model)
	local currentAngle = 0
	local modelCF, modelSize = model:GetBoundingBox()	
	
	local rotInv = (modelCF - modelCF.p):inverse()
	modelCF = modelCF * rotInv
	modelSize = rotInv * modelSize
	modelSize = Vector3.new(math.abs(modelSize.x), math.abs(modelSize.y), math.abs(modelSize.z))
	
	local diagonal = 0
	local maxExtent = math.max(modelSize.x, modelSize.y, modelSize.z)
	local tan = math.tan(math.rad(camera.FieldOfView/2))
	
	if (maxExtent == modelSize.x) then
		diagonal = math.sqrt(modelSize.y*modelSize.y + modelSize.z*modelSize.z)/2
	elseif (maxExtent == modelSize.y) then
		diagonal = math.sqrt(modelSize.x*modelSize.x + modelSize.z*modelSize.z)/2
	else
		diagonal = math.sqrt(modelSize.x*modelSize.x + modelSize.y*modelSize.y)/2
	end
	
	local minDist = (maxExtent/2)/tan + diagonal

	return game:GetService("RunService").RenderStepped:Connect(function(dt)
		currentAngle = currentAngle + 1*dt*60
		camera.CFrame = modelCF * CFrame.fromEulerAnglesYXZ(0, math.rad(currentAngle), 0) * CFrame.new(0, 0, minDist + 3)
	end)
end
*/

function setDefaultCameraView(camera: Camera, model: Model) {
	let currentAngle = 0;
	let [modelCF, modelSize] = model.GetBoundingBox();
	const rotInv = modelCF.sub(modelCF.Position).Inverse();
	modelCF = modelCF.mul(rotInv);
	modelSize = rotInv.mul(modelSize);
	modelSize = new Vector3(math.abs(modelSize.X), math.abs(modelSize.Y), math.abs(modelSize.Z));

	let diagonal = 0;
	const maxExtent = math.max(modelSize.X, modelSize.Y, modelSize.Z);
	const tan = math.tan(math.rad(camera.FieldOfView / 2));

	if (maxExtent === modelSize.X) {
		diagonal = math.sqrt(modelSize.Y * modelSize.Y + modelSize.Z * modelSize.Z) / 2;
	} else if (maxExtent === modelSize.Y) {
		diagonal = math.sqrt(modelSize.X * modelSize.X + modelSize.Z * modelSize.Z) / 2;
	} else {
		diagonal = math.sqrt(modelSize.X * modelSize.X + modelSize.Y * modelSize.Y) / 2;
	}

	const minDist = maxExtent / 2 / tan + diagonal;
	camera.FieldOfView = 30;

	coroutine.wrap(() => {
		RunService.RenderStepped.Connect((dt) => {
			currentAngle += 1 * dt * 60;
			camera.CFrame = modelCF
				.mul(CFrame.fromEulerAnglesYXZ(0, math.rad(currentAngle), 0))
				.mul(new CFrame(0, 0, minDist + 3));
		});
	})();
}

const InnerObjectViewport: Hooks.FC<IProps> = (props, hooks) => {
	// Setup the viewport after mounting when we have a ref to it
	const viewportRef = Roact.createRef<ViewportFrame>();
	useMountEffect(() => {
		const viewport = viewportRef.getValue()!;

		let model = props.instance;
		if (!model.IsA("Model")) {
			model = Make("Model", {
				PrimaryPart: props.instance as BasePart,
				Children: [props.instance],
			});
		}
		model.Parent = viewport;

		const viewportCamera = new Instance("Camera");
		viewport.CurrentCamera = viewportCamera;
		setDefaultCameraView(viewportCamera, model);
		viewportCamera.Parent = viewport;
	}, hooks);

	return (
		<viewportframe {...props.nativeProps} Ref={viewportRef}>
			{props[Roact.Children]}
		</viewportframe>
	);
};

export const ObjectViewport = new Hooks(Roact)(InnerObjectViewport, {
	componentType: "PureComponent",
	defaultProps: {},
});
