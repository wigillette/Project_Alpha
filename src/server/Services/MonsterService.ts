import GoldService from "./GoldService";
import LevelService from "./LevelService";
import { KnitServer as Knit, RemoteSignal } from "@rbxts/knit";
import { Players, Workspace, Lighting, TweenService, RunService } from "@rbxts/services";
import MonsterData from "../../shared/MonsterData";
import ObjectUtils from "@rbxts/object-utils";

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

		const findNearestTarget = (pos: Vector3) => {
			let dist = 10000;
			let chosen: BasePart | undefined = undefined;
			if (regionAssetsFolder) {
				Workspace.GetChildren().forEach((Child) => {
					if (Child.IsA("Model")) {
						const hum = Child.FindFirstChildOfClass("Humanoid") as Humanoid;
						const hrp = Child.FindFirstChild("HumanoidRootPart") as BasePart;
						if (hum && hrp && hum.Health > 0 && hrp.Position.sub(pos).Magnitude - 10 < dist) {
							chosen = hrp;
							dist = hrp.Position.sub(pos).Magnitude - 10;
						}
					}
				});
				regionAssetsFolder.GetChildren().forEach((Folder) => {
					Folder.GetChildren().forEach((Child) => {
						if (Child.IsA("Model")) {
							if (Child.PrimaryPart && Child.PrimaryPart.Position.sub(pos).Magnitude < dist) {
								const health = Child.FindFirstChild("ObjectHealth") as NumberValue;
								if (health && health.Value > 0) {
									chosen = Child.PrimaryPart;
									dist = Child.PrimaryPart.Position.sub(pos).Magnitude;
								}
							}
						}
					});
				});
			}
			return chosen;
		};

		const monsterChoices = ObjectUtils.keys(monsterInfo);
		for (let i = 0; i < Duration; i++) {
			spawnTime = math.floor(math.random() * 4) + 2;
			if (i % spawnTime === 0 && spawnedFolder) {
				randomKey = monsterChoices[math.floor(math.random() * monsterChoices.size())];
				randomMonster = monsterInfo[randomKey as keyof typeof monsterInfo];
				monsterModel = randomMonster.Model as Model;
				if (monsterModel) {
					newMonsterModel = monsterModel.Clone();
					humanoid = newMonsterModel.FindFirstChildOfClass("Humanoid");
					if (humanoid) {
						deathConnection = humanoid.Died.Connect(() => {
							killerTag = newMonsterModel.FindFirstChild("KillerTag") as ObjectValue;
							if (killerTag && killerTag.Value) {
								killer = killerTag.Value as Player;
								this.onMonsterDeath(killer, randomMonster);
							}
						});
						coroutine.wrap(() => {
							do {
								if (newMonsterModel) {
									const hrp = newMonsterModel.FindFirstChild("HumanoidRootPart") as BasePart;
									const hum = newMonsterModel.FindFirstChildOfClass("Humanoid") as Humanoid;
									if (hrp && hum) {
										const target = findNearestTarget(hrp.Position) as BasePart | undefined;
										if (target) {
											hum.MoveTo(target.Position, target);
										}
									}
								}
								wait(1);
							} while (this.WAVE_RUNNING);
						})();
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
