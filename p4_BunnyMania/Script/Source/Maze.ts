namespace Script {
    import Vector3 = FudgeCore.Vector3;

    enum ItemType {
        Star,
        PowerUp,
        Lives,
        AdditionalTime,
        Empty, // Add Empty as a value
    }

    enum TileType {
        Ground,
        Border,
        Cube,
        Empty,
    }

    let itemTypeArray: ItemType[] = [];
    itemTypeArray[0] = 0;
    let itemNumber: number = 1;
    let previousItem: number = 0;
    let lastItem: ItemType = ItemType.Empty;

    let itemScale: number = 0.5;

    export class Maze {
        private readonly width: number;
        private readonly height: number;
        private readonly grid: TileType[][];

        constructor(_width: number, _height: number) {
            this.width = _width;
            this.height = _height;
            this.grid = this.createEmptyGrid();
        }

        private createEmptyGrid(): TileType[][] {
            const grid: TileType[][] = [];

            for (let z = 0; z < this.width; z++) {
                const row: TileType[] = [];
                for (let x = 0; x < this.height; x++) {
                    row.push(TileType.Empty);
                }
                grid.push(row);
            }

            return grid;
        }

        public addItems() {
            for (let z = 0; z < this.height; z++) {
                for (let x = 0; x < this.width; x++) {
                    if (this.grid[z][x] === TileType.Empty) {
                        let randomNumber: number = Math.random();
                        let itemType: ItemType;

                        if (randomNumber <= 0.01) { // 1%
                            itemType = ItemType.Lives;
                        } else if (randomNumber <= 0.05) { // 4%
                            itemType = ItemType.PowerUp;
                        } else if (randomNumber <= 0.12) { // 7%
                            itemType = ItemType.AdditionalTime;
                        } else {
                            itemType = ItemType.Star;
                        }

                        // Checks for Vertical Duplicates
                        previousItem++;

                        if (itemNumber >= 17) {
                            if (itemType == itemTypeArray[previousItem]) {
                                itemType = ItemType.Star;
                            } else {
                                //console.log("type:" + itemType);
                            }
                        }
                        itemTypeArray[previousItem] = itemType;

                        if (previousItem == 16) {
                            previousItem = 0;
                        }

                        itemNumber++;

                        // Checks for Horizontal Duplicates
                        if (lastItem == itemType) {
                            itemType = ItemType.Star;
                        }
                        lastItem = itemType;

                        // Add the item based on the itemType
                        switch (itemType) {

                            case ItemType.Star:
                                this.addStar(x, z);
                                break;
                            case ItemType.PowerUp:
                                this.addPowerUp(x, z);
                                break;
                            case ItemType.Lives:
                                this.addLives(x, z);
                                break;
                            case ItemType.AdditionalTime:
                                this.addAdditionalTime(x, z);
                                break;
                        }
                    }
                }
            }
        }

        protected addStar(x: number, z: number): void {
            const star: Star = new Star(new Vector3(x, 0.5, z), itemScale);
            items.addChild(star);
        }

        protected addPowerUp(x: number, z: number): void {
            const powerUp: PowerUp = new PowerUp(new Vector3(x, 0.5, z), itemScale);
            items.addChild(powerUp);
        }

        protected addLives(x: number, z: number): void {
            const lives: Lives = new Lives(new Vector3(x, 0.5, z), itemScale);
            items.addChild(lives);
        }

        protected addAdditionalTime(x: number, z: number): void {
            const additionalTime: AdditionalTime = new AdditionalTime(new Vector3(x, 0.5, z), itemScale);
            items.addChild(additionalTime);
        }
    }
}