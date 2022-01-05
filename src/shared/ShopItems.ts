interface ItemsFormat {
	[Name: string]: { Price: number; Category: string };
}

const ShopItems: ItemsFormat = {
	Pistol: { Price: 50, Category: "Weapons" },
	RedBlock: { Price: 100, Category: "Assets" },
	RedWedge: { Price: 200, Category: "Assets" },
};

export default ShopItems;
