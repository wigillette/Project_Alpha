interface ItemsFormat {
	[Name: string]: { Price: number; Category: string };
}

const ShopItems = {
	Pistol: { Price: 50, Category: "Weapons", Health: 0 },
	RedBlock: { Price: 100, Category: "Assets", Health: 50 },
	RedWedge: { Price: 200, Category: "Assets", Health: 25 },
};

export default ShopItems;
