import GoldService from "./GoldService";
import LevelService from "./LevelService";
import { KnitServer as Knit, RemoteSignal } from "@rbxts/knit";
import { Players, Workspace, Lighting, TweenService, RunService, ReplicatedStorage } from "@rbxts/services";
import MonsterData from "../../shared/MonsterData";
import ObjectUtils from "@rbxts/object-utils";
import InventoryService from "./InventoryService";
import ChatService from "./ChatService";

declare global {
	interface KnitServices {
		MonsterService: typeof MonsterService;
	}
}

interface MonsterFormat {
	Model: Model;
	Gold: number;
	Experience: number;
}

const MonsterService = Knit.CreateService({
	Name: "MonsterService",

	DeathConnections: [] as RBXScriptConnection[],
	WAVE_RUNNING: false,

	Client: {
		isWaveRunning(Player: Player) {
			return this.Server.isWaveRunning();
		},
	},

	GiveWeapons() {
		const weaponsFolder = ReplicatedStorage.WaitForChild("Weapons");
		let equipped, weaponModel, weapon, newWeapon;
		Players.GetPlayers().forEach((player) => {
			equipped = InventoryService.FetchEquipped(player);
			if (equipped) {
				weaponModel = weaponsFolder.FindFirstChild(equipped.Weapons);
				if (weaponModel) {
					weapon = weaponModel.FindFirstChildOfClass("Tool");
					if (weapon) {
						newWeapon = weapon.Clone();
						newWeapon.Parent = player.WaitForChild("Backpack");
						newWeapon.Clone().Parent = player.WaitForChild("StarterGear");
					}
				}
			}
		});
	},

	isWaveRunning() {
		return this.WAVE_RUNNING;
	},

	RemoveWeapons() {
		Players.GetPlayers().forEach((player) => {
			if (player) {
				player.WaitForChild("Backpack").ClearAllChildren();
				player.WaitForChild("StarterGear").ClearAllChildren();
				const char = player.Character;
				if (char) {
					const tool = char.FindFirstChildOfClass("Tool");
					if (tool) {
						tool.Destroy();
					}
				}
			}
		});
	},

	SpawnMonsters(Duration: number) {
		const monsterInfo = MonsterData.Monsters;
		const spawnedFolder = Workspace.FindFirstChild("Spawned");
		const regionAssetsFolder = Workspace.FindFirstChild("RegionAssets");
		let spawnTime;
		let randomKey: string;
		let randomMonster: MonsterFormat;
		let humanoid;
		let monsterModel: Model;
		let deathConnection: RBXScriptConnection;
		let newMonsterModel: Model;
		let killerTag: ObjectValue;
		let killer: Player;
		let monsterPrimaryPart;
		let randomX;
		let randomZ;

		this.WAVE_RUNNING = true;
		// Change to darkness hehehe
		const tween = TweenService.Create(
			Lighting,
			new TweenInfo(4, Enum.EasingStyle.Quint, Enum.EasingDirection.Out, 0, false, 0),
			{ ClockTime: 22 },
		);
		tween.Play();

		ChatService.PostAllFeedback(
			`Survive the incoming monster wave for ${Duration} seconds!`,
			Color3.fromRGB(255, 0, 0),
		);
		this.GiveWeapons();

		const monsterChoices = ObjectUtils.keys(monsterInfo);
		for (let i = 0; i < Duration; i++) {
			spawnTime = math.floor(math.random() * 4) + 2;
			if (i % spawnTime === 0 && spawnedFolder) {
				randomKey = monsterChoices[math.floor(math.random() * monsterChoices.size())];
				randomMonster = monsterInfo[randomKey as keyof typeof monsterInfo];
				monsterModel = randomMonster.Model as Model;
				if (monsterModel) {
					newMonsterModel = monsterModel.Clone();
					humanoid = newMonsterModel.FindFirstChildOfClass("Humanoid") as Humanoid;
					if (humanoid) {
						deathConnection = humanoid.Died.Connect(() => {
							humanoid = newMonsterModel.FindFirstChildOfClass("Humanoid") as Humanoid;
							if (humanoid) {
								killerTag = humanoid.FindFirstChild("KillerTag") as ObjectValue;
								if (killerTag && killerTag.Value) {
									killer = killerTag.Value as Player;
									this.onMonsterDeath(killer, randomMonster);
								}
							}
						});

						this.DeathConnections.push(deathConnection);
						newMonsterModel.Parent = spawnedFolder;
						monsterPrimaryPart = newMonsterModel.PrimaryPart;
						if (monsterPrimaryPart) {
							randomX = math.floor(math.random() * 509) - 255; // Change to edges of the map
							randomZ = math.floor(math.random() * 509) - 255;
							newMonsterModel.SetPrimaryPartCFrame(new CFrame(new Vector3(randomX, 2, randomZ)));
						}
					}
				}
			}
			wait(1);
		}
	},

	RemoveMonsters() {
		const spawnedFolder = Workspace.FindFirstChild("Spawned");
		if (spawnedFolder) {
			this.DeathConnections.forEach((connection) => {
				connection.Disconnect();
			});
			spawnedFolder.ClearAllChildren();
		}

		const tween = TweenService.Create(
			Lighting,
			new TweenInfo(4, Enum.EasingStyle.Quint, Enum.EasingDirection.Out, 0, false, 0),
			{ ClockTime: 10 },
		);
		tween.Play();
		this.WAVE_RUNNING = false;
		this.RemoveWeapons();
		ChatService.PostAllFeedback(`The monster wave has ended!`, Color3.fromRGB(255, 0, 0));
	},

	onMonsterDeath(Killer: Player, MonsterData: MonsterFormat) {
		LevelService.AddExp(Killer, MonsterData.Experience);
		GoldService.AddGold(Killer, MonsterData.Gold);
	},

	KnitInit() {
		coroutine.wrap(() => {
			let CURRENT_DURATION;
			do {
				wait();
			} while (Players.GetPlayers().size() <= 0);
			do {
				CURRENT_DURATION =
					math.floor(math.random() * (MonsterData.WaveDuration.MaxTime - MonsterData.WaveDuration.MinTime)) +
					MonsterData.WaveDuration.MinTime;
				print(`Waiting Time: ${CURRENT_DURATION}`);
				wait(CURRENT_DURATION);
				this.SpawnMonsters(CURRENT_DURATION);
				this.RemoveMonsters();
			} while (Players.GetPlayers().size() > 0);
		})();
		print("Monster Service Initialized | Server");
	},
});

export default MonsterService;
