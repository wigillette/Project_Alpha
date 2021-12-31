const LevelSettings = {
	InitialProfile: {
		Level: 1,
		Experience: 0,
		ExperienceCap: 50,
	},
	CalculateCap: (level: number) => {
		return math.ceil(math.pow(level, 1.5) * 50);
	},
};

export default LevelSettings;
