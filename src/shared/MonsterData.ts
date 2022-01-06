import { ServerStorage } from "@rbxts/services";
const MonsterFolder = ServerStorage.WaitForChild("Monsters");

const MonsterData = {
	Monsters: {
		Zombie: {
			Model: MonsterFolder.FindFirstChild("Zombie") as Model,
			Gold: 50,
			Experience: 5,
		},
	},
	WaveDuration: {
		MaxTime: 60,
		MinTime: 30,
	},
};

export default MonsterData;
