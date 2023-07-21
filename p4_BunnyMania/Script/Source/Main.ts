namespace Script {
  import ƒ = FudgeCore;
  import Vector3 = FudgeCore.Vector3;
  //import Mesh = FudgeCore.Mesh;

  enum TileType {
    Ground,
    Border,
    Cube,
    Empty,
  }

  let viewport: ƒ.Viewport;
  let graph: ƒ.Node;
  let maze: ƒ.Node;
  let character: ƒ.Node;
  let characterA: ƒ.Node;
  let cmpRigidbody: ƒ.ComponentRigidbody;


  export let rabbit: ƒ.Node

  let isGrounded: boolean = false;

  //@ts-ignore
  document.addEventListener("interactiveViewportStarted", start);

  async function start(_event: CustomEvent): Promise<void> {
    viewport = _event.detail;

    graph = viewport.getBranch();
    console.log(graph);

    maze = graph.getChildrenByName("Maze")[0];
    const myMaze: Maze = new Maze(16, 16);

    character = graph.getChildrenByName("Character")[0];
    console.log(character);

    let cameraNode: ƒ.Node = character.getChildrenByName("Camera")[0];
    console.log(cameraNode);
    let camera: ƒ.ComponentCamera = cameraNode.getComponent(ƒ.ComponentCamera);
    console.log(camera);

    //viewport.camera = camera;
    viewport.camera = viewport.camera;

    // Add stars and power-ups to the maze where there are no cubes
    myMaze.addStarsAndPowerUps1();


    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();

    setUpCharacter();

    //loadMesh

  }



  // async function loadMesh(): Promise<void> {

  //   let meshURL: string = new URL(this.url.toString(), Project.baseURL).toString();

  //   try {
  //     const mesh: Mesh = await meshURL.load(meshURL);
  //     // Create a new node and add the loaded mesh as a component
  //     const node: ƒ.Node = new ƒ.Node("MeshNode");
  //     const cmpMesh: ƒ.ComponentMesh = new ƒ.ComponentMesh(mesh);

  //     // Optionally, you can also create a material and add it to the mesh
  //     const material: ƒ.Material = new ƒ.Material("Material", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(1, 0.5, 0.3, 1)));
  //     const cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(material);
  //     node.addComponent(cmpMaterial);

  //     // Position and scale the mesh node as needed
  //     const transform: ƒ.
  //     node.mtxLocal.translate();
  //     node.mtxLocal.scale(new Vector3(1, 1, 1));

  //     rabbit = new ƒ.Node("Rabbit");

  //     rabbit.addComponent(cmpMesh);
  //     rabbit.addComponent(cmpMaterial);
  //     rabbit.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(new Vector3(0, 0, 0))));

  //     viewport.getBranch().addChild(rabbit);


  //   } catch (error) {
  //     console.error("Error", error);
  //   }
  //}

  function update(_event: Event): void {

    characterMovement();

    ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  function setUpCharacter(): void {

    characterA = graph.getChildrenByName("Character")[0];

    cmpRigidbody = characterA.getComponent(ƒ.ComponentRigidbody);
    cmpRigidbody.mass = 5;
    cmpRigidbody.friction = 0.8;
    cmpRigidbody.dampTranslation = 5;

    cmpRigidbody.addEventListener(ƒ.EVENT_PHYSICS.COLLISION_ENTER, characterCollision);
  }

  function characterCollision(_event: ƒ.EventPhysics): void {
    let vctCollision: ƒ.Vector3 = ƒ.Vector3.DIFFERENCE(_event.collisionPoint, characterA.mtxWorld.translation);
    isGrounded = true;
    characterA.mtxWorld.translate(vctCollision);

  }

  function characterMovement(): void {

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D])) {
      cmpRigidbody.setVelocity(ƒ.Vector3.X(-5))
    }

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A])) {
      cmpRigidbody.setVelocity(ƒ.Vector3.X(5))
    }

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_UP, ƒ.KEYBOARD_CODE.W])) {
      cmpRigidbody.setVelocity(ƒ.Vector3.Z(5))
    }

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_DOWN, ƒ.KEYBOARD_CODE.S])) {
      cmpRigidbody.setVelocity(ƒ.Vector3.Z(-5))
    }
  }

  enum ItemType {
    Star,
    PowerUp,
    Lives,
    AdditionalTime,
    Empty, // Add Empty as a value
  }

  let itemTypeArray: ItemType[] = [];
  itemTypeArray[0] = 0;
  let itemNumber: number = 1;
  let previousItem: number = 0;
  let lastItem: ItemType = ItemType.Empty;

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

    public addStarsAndPowerUps1() {
      for (let z = 0; z < this.height; z++) {
        for (let x = 0; x < this.width; x++) {
          if (this.grid[z][x] === TileType.Empty) {
            if (!isCollidingWithLevel1(x, z)) {
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
    let lengthDifference: number = posA.magnitude - posB.magnitude; // Magnitude = Length of Vector
    return lengthDifference <= distance;
  }


}
