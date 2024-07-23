namespace Script {
    import Vector3 = FudgeCore.Vector3;

    enum ItemType {
        Star,               //0
        AdditionalTime,     //1
        PowerUp,            //2
        Life,               //3
        Empty,
    }

    export enum TileType {
        Bush,   // 0
        Empty,  // 1
    }

    let itemTypeArray: ItemType[] = [];
    itemTypeArray[0] = 0;
    let itemNumber: number = 0;
    let previousItem: number = 0;
    let lastItem: ItemType = ItemType.Empty;

    export let indexStar: number = 0;
    export let indexAddTime: number = 0;
    export let indexPowerUp: number = 0;
    export let indexLife: number = 0;
    export let indexFox: number = 0;

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

            grid.push(row0);
            grid.push(row1);
            grid.push(row2);
            grid.push(row3);
            grid.push(row4);
            grid.push(row5);
            grid.push(row6);
            grid.push(row7);
            grid.push(row8);
            grid.push(row9);
            grid.push(row10);
            grid.push(row11);
            grid.push(row12);
            grid.push(row13);
            grid.push(row14);
            grid.push(row15);

            // console.log(grid);
            return grid;
        }

        public addItems() {
            for (let z = 0; z < this.height; z++) {
                for (let x = 0; x < this.width; x++) {

                    if (this.grid[z][x] === TileType.Empty) {
                        let randomNumber: number = Math.random();
                        let itemType: ItemType;

                        if (randomNumber <= 0.012 && indexLife < 2) { // 1,2%
                            itemType = ItemType.Life;
                        } else if (randomNumber <= 0.023 && indexPowerUp < 4) { // 2,3%
                            itemType = ItemType.PowerUp;
                        } else if (randomNumber <= 0.071 && indexAddTime < 12) { // 7,1%
                            itemType = ItemType.AdditionalTime;
                        } else {
                            itemType = ItemType.Star;
                        }

                        // Checks for vertical Duplicates
                        previousItem++;

                        if (itemNumber >= 17) {
                            if (itemType == itemTypeArray[previousItem]) {
                                itemType = ItemType.Star;
                            }
                        }
                        itemTypeArray[previousItem] = itemType;

                        if (previousItem == 16) {
                            previousItem = 0;
                        }

                        itemNumber++;

                        // Checks for horizontal Duplicates
                        if (lastItem == itemType) {
                            itemType = ItemType.Star;
                        }
                        lastItem = itemType;

                        // Checks if the last Item is Type Life
                        if (itemNumber == 256 && itemType == ItemType.Life) {
                            itemType = ItemType.Star;
                        }
                        lastItem = itemType;

                        // Add the item based on the itemType
                        switch (itemType) {

                            case ItemType.Star:
                                this.addStar(x, z);
                                break;
                            case ItemType.AdditionalTime:
                                this.addAdditionalTime(x, z);
                                break;
                            case ItemType.PowerUp:
                                this.addPowerUp(x, z);
                                break;
                            case ItemType.Life:
                                this.addLifes(x, z);
                                break;
                        }
                    }
                }
            }
        }

        protected addStar(x: number, z: number): void {
            indexStar++;
            const star: Star = new Star(new Vector3(x, 0.5, z), indexStar);
            items.addChild(star);
        }

        protected addAdditionalTime(x: number, z: number): void {
            indexAddTime++;
            const additionalTime: AdditionalTime = new AdditionalTime(new Vector3(x, 0, z), indexAddTime);
            items.addChild(additionalTime);
        }

        protected addPowerUp(x: number, z: number): void {
            indexPowerUp++;
            const powerUp: PowerUp = new PowerUp(new Vector3(x, 0, z), indexPowerUp);
            items.addChild(powerUp);
        }

        protected addLifes(x: number, z: number): void {
            indexLife++;
            const life: Life = new Life(new Vector3(x, 0, z), indexLife);
            items.addChild(life);
        }

        public addFoes(): void {
            indexFox++;
            const fox: Fox = new Fox(indexFox);
            foes.addChild(fox);
        }
    }
}