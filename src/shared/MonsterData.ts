import { ServerStorage } from "@rbxts/services";
const MonsterFolder = ServerStorage.WaitForChild("Monsters");

const MonsterData = {
	Monsters: {
		Zombie: {
			Model: MonsterFolder.FindFirstChild("Zombie") as Model,
			Gold: 50,
			Experience: 5,
		},
		["Freddy Krueger"]: {
			Model: MonsterFolder.FindFirstChild("Freddy Krueger") as Model,
			Gold: 100,
			Experience: 50,
		},
		Jason: {
			Model: MonsterFolder.FindFirstChild("Jason") as Model,
			Gold: 100,
			Experience: 50,
		},
	},
	WaveDuration: {
		MaxTime: 60,
		MinTime: 30,
	},
};

export default MonsterData;
