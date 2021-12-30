import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import EffectsHandler from "../../shared/EffectsHandler";

interface UIProps {}

let ProfileBar = (props: UIProps) => {
	return <screengui ResetOnSpawn={false}></screengui>;
};

interface NewProfileState {
	newProfile: { level: number; experience: number; experienceCap: number };
}

export default ProfileBar = RoactRodux.connect(
	function (state: NewProfileState, props) {
		return {
			level: state.newProfile.level,
			experience: state.newProfile.experience,
			experienceCap: state.newProfile.experienceCap,
		};
	},
	function (dispatch) {
		return {
			onClick: function () {
				dispatch({
					type: "UpdateProfile",
					level: 0,
					experience: 0,
					experienceCap: 0,
				});
			},
		};
	},
)(ProfileBar);
