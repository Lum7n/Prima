namespace Script {
  import ƒ = FudgeCore;
  import Vector3 = FudgeCore.Vector3;

  let maze: ƒ.Node;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    maze = viewport.getBranch().getChildrenByName("Maze")[0];

    const myMaze: Maze = new Maze(16, 16);

    // Add stars and power-ups to the maze where there are no cubes
    myMaze.addStarsAndPowerUps1();

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    // ƒ.Loop.start();  // start the game loop to continuously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  }

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

      for (let z = 0; z < this.height; z++) {
        const row: TileType[] = [];
        for (let x = 0; x < this.width; x++) {
          row.push(TileType.Empty);
        }
        grid.push(row);
      }

      return grid;
    }


    private previousItemType: ItemType = ItemType.Empty; // Initialize with Empty
    public addStarsAndPowerUps1() {
      for (let z = 0; z < this.height; z++) {
        for (let x = 0; x < this.width; x++) {
          if (this.grid[z][x] === TileType.Empty) {
            if (!isCollidingWithLevel1(x, z)) {
              let randomNumber: number = Math.random();
              let itemType: ItemType;

              if (randomNumber <= 0.005) { // 0.5%
                itemType = ItemType.Lives;
              } else if (randomNumber <= 0.03) { // 2.5%
                itemType = ItemType.PowerUp;
              } else if (randomNumber <= 0.08) { // 4.5%
                itemType = ItemType.AdditionalTime;
              } else {
                itemType = ItemType.Star;
              }

              // Check if the current item type is the same as the previous one
              while (itemType === this.previousItemType) {
                itemType = ItemType.Star; // If same, set it to Star (you can choose another default type if you prefer)
              }

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

              // Update the previousItemType
              this.previousItemType = itemType;
            }
          }
        }
      }
    }

    protected addStar(x: number, z: number): void {
      const star: Star = new Star(new Vector3(x, 0.5, z));
      maze.addChild(star);
    }

    protected addPowerUp(x: number, z: number): void {
      const powerUp: PowerUp = new PowerUp(new Vector3(x, 0.5, z));
      maze.addChild(powerUp);
    }

    protected addLives(x: number, z: number): void {
      const lives: Lives = new Lives(new Vector3(x, 0.5, z));
      maze.addChild(lives);
    }

    protected addAdditionalTime(x: number, z: number): void {
      const additionalTime: AdditionalTime = new AdditionalTime(new Vector3(x, 0.5, z));
      maze.addChild(additionalTime);
    }
  }

  enum ItemType {
    Star,
    PowerUp,
    Lives,
    AdditionalTime,
    Empty//Its foking empty
  }

  function isCollidingWithLevel1(x: number, z: number): boolean {
    let level1Node: ƒ.Node = maze.getChildrenByName("Level 1")[0];
    let childrenOfLevel1: ƒ.Node[] = level1Node.getChildren();
    //let i: number = 0;

    for (let i = 0; i < childrenOfLevel1.length; i++) {
      //console.log(childrenOfLevel1);
      if (isColliding(new Vector3(x, 0.5, z), childrenOfLevel1[i].mtxLocal.translation) == true) {
        console.log(i);
        console.log(childrenOfLevel1[i]);
        return true;
        //new Vector3(0.5, 0.5, 0.5)
      }
    }
    //console.log(childrenOfLevel1[i])
    return false;
  }

  function isColliding(posA: Vector3, posB: Vector3): boolean {
    const distance: number = -10; // Adjust this value depending on the size of the cubes or nodes
    //console.log(posA);
    let lengthDifference :number = posA.magnitude - posB.magnitude; // Magnitude = Length of Vector
    if (lengthDifference <= distance) {
      return true;
    } else {
      return false;
    }
  }





  enum TileType {
    Ground,
    Border,
    Cube,
    Empty,
  }
}
