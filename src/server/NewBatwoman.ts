/* eslint-disable prettier/prettier */
class Batwoman {
	name = "";
	constructor(name: string) {
		this.name = name;
	}

	speak() {
		print(`New look? New ${this.name}`);
	}
}

export default Batwoman;
