namespace Script {
  import ƒ = FudgeCore;
  // import ƒAid = FudgeAid;
  import Vector3 = FudgeCore.Vector3;
  console.log(Vector3);

  let viewport: ƒ.Viewport;
  let graph: ƒ.Node;
  let maze: ƒ.Node;
  let character: ƒ.Node;
  let cmpRigidbody: ƒ.ComponentRigidbody;
  let sound: ƒ.Node;

  export let items: ƒ.Node;
  export let itemAnimation: ƒ.Animation = new ƒ.Animation;

  let life1: ƒ.Node;
  let life2: ƒ.Node;
  export let lifeArray: ƒ.Node[] = [];

  let powerUp1: ƒ.Node;
  let powerUp2: ƒ.Node;
  let powerUp3: ƒ.Node;
  let powerUp4: ƒ.Node;
  export let powerUpArray: ƒ.Node[] = [];

  let addTime1: ƒ.Node;
  let addTime2: ƒ.Node;
  let addTime3: ƒ.Node;
  let addTime4: ƒ.Node;
  let addTime5: ƒ.Node;
  let addTime6: ƒ.Node;
  let addTime7: ƒ.Node;
  let addTime8: ƒ.Node;
  let addTime9: ƒ.Node;
  let addTime10: ƒ.Node;
  let addTime11: ƒ.Node;
  let addTime12: ƒ.Node;
  export let addTimeArray: ƒ.Node[] = [];

  interface ExternalData {
    [name: string]: number;
  }
  let externalConfig: ExternalData;
  export let initialLivesAmount: number;

  // export let gameState: GameState;

  let objectAte: number = 0;
  let gameInterface: GameInterface;
  let starPling: ƒ.ComponentAudio;
  let itemAte: ƒ.ComponentAudio;

  let won: boolean = false;

  let gameTime: ƒ.Time;
  let timer: ƒ.Timer;

  //@ts-ignore
  document.addEventListener("interactiveViewportStarted", start);

  async function start(_event: CustomEvent): Promise<void> {
    viewport = _event.detail;

    graph = viewport.getBranch();
    console.log(graph);

    await getExternalData();

    maze = graph.getChildrenByName("Maze")[0];
    items = maze.getChildrenByName("Items")[0];

    getItemNodes();

    // itemAnimation.idResource = "Animation|2023-07-21T22:24:47.000Z|55709";
    // console.log(itemAnimation);

    const myMaze: Maze = new Maze(16, 16);
    // Add stars and power-ups to the maze where there are no cubes
    myMaze.addItems();

    character = graph.getChildrenByName("Character")[0];
    console.log(character);

    let cameraNode: ƒ.Node = character.getChildrenByName("Camera")[0];
    console.log(cameraNode);
    let camera: ƒ.ComponentCamera = cameraNode.getComponent(ƒ.ComponentCamera);
    console.log(camera);

    viewport.camera = camera;

    sound = graph.getChildrenByName("Audio")[0];
    starPling = sound.getChildrenByName("Star")[0].getComponent(ƒ.ComponentAudio);
    itemAte = sound.getChildrenByName("otherItem")[0].getComponent(ƒ.ComponentAudio);

    gameTime = new ƒ.Time();
    timer = new ƒ.Timer(gameTime, 1000, 0, updateTimer);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics

    setUpCharacter();

    gameInterface = new GameInterface(initialLivesAmount);

  }

  function update(_event: Event): void {

    characterMovement();

    gameInterface.updateUserInterface();

    ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();

  }

  async function getExternalData(): Promise<void> {
    let response: Response = await fetch("External.json");
    externalConfig = await response.json();
    initialLivesAmount = externalConfig["initialLivesAmount"];
    console.log(initialLivesAmount);

    // gameState = new GameState(gameDuration);
  }

  function getItemNodes(): void {

    life1 = items.getChildrenByName("Life1")[0];
    life2 = items.getChildrenByName("Life2")[0];
    lifeArray[1] = life1;
    lifeArray[2] = life2;
    console.log(lifeArray);

    powerUp1 = items.getChildrenByName("PowerUp1")[0];
    powerUp2 = items.getChildrenByName("PowerUp2")[0];
    powerUp3 = items.getChildrenByName("PowerUp3")[0];
    powerUp4 = items.getChildrenByName("PowerUp4")[0];
    powerUpArray[1] = powerUp1;
    powerUpArray[2] = powerUp2;
    powerUpArray[3] = powerUp3;
    powerUpArray[4] = powerUp4;
    console.log(powerUpArray);

    addTime1 = items.getChildrenByName("AddTime1")[0];
    addTime2 = items.getChildrenByName("AddTime2")[0];
    addTime3 = items.getChildrenByName("AddTime3")[0];
    addTime4 = items.getChildrenByName("AddTime4")[0];
    addTime5 = items.getChildrenByName("AddTime5")[0];
    addTime6 = items.getChildrenByName("AddTime6")[0];
    addTime7 = items.getChildrenByName("AddTime7")[0];
    addTime8 = items.getChildrenByName("AddTime8")[0];
    addTime9 = items.getChildrenByName("AddTime9")[0];
    addTime10 = items.getChildrenByName("AddTime10")[0];
    addTime11 = items.getChildrenByName("AddTime11")[0];
    addTime12 = items.getChildrenByName("AddTime12")[0];
    addTimeArray[1] = addTime1;
    addTimeArray[2] = addTime2;
    addTimeArray[3] = addTime3;
    addTimeArray[4] = addTime4;
    addTimeArray[5] = addTime5;
    addTimeArray[6] = addTime6;
    addTimeArray[7] = addTime7;
    addTimeArray[8] = addTime8;
    addTimeArray[9] = addTime9;
    addTimeArray[10] = addTime10;
    addTimeArray[11] = addTime11;
    addTimeArray[12] = addTime12;
    console.log(addTimeArray);
  }

  function setUpCharacter(): void {

    cmpRigidbody = character.getComponent(ƒ.ComponentRigidbody);
    cmpRigidbody.mass = 8000;
    cmpRigidbody.friction = 10;
    cmpRigidbody.dampTranslation = 5;
    cmpRigidbody.effectRotation.y = 0;
    cmpRigidbody.addEventListener(ƒ.EVENT_PHYSICS.TRIGGER_ENTER, collision);
  }

  function collision(_event: ƒ.EventPhysics): void {

    console.log(_event.cmpRigidbody.node);

    let collidedWithObject: ƒ.Node = _event.cmpRigidbody.node;
    let objectParent: ƒ.Node = collidedWithObject.getParent();
    objectParent.removeChild(collidedWithObject);
    objectAte++;
    console.log(objectAte);
    if (objectAte == 10) { //170
      let finalPoints: number = gameInterface.points;
      let finalTime: number = gameInterface.time;
      console.log("final: " + finalPoints + " and " + finalTime);
      gameInterface.showEndscreen(finalPoints, finalTime);
      won = true;
      timer.active = false;
    }

    character.mtxLocal.rotation = new ƒ.Vector3(0, 0, 0);
    character.mtxWorld.rotation = new ƒ.Vector3(0, 0, 0);
    cmpRigidbody.dampRotation = 0;

    console.log("Local " + character.mtxLocal.rotation);
    console.log("World " + character.mtxWorld.rotation);

    //check the object and adds points, lives, sounds
    switch (collidedWithObject.name) {

      case "Star":
        gameInterface.points += 20;
        starPling.play(true);
        break;
      case "AdditionalTime":
        gameInterface.points += 5;
        gameInterface.time -= 5;
        itemAte.play(true);
        break;
      case "PowerUp":
        console.error("PowerUp Added!");
        gameInterface.points += 10;
        itemAte.play(true);
        break;
      case "Life":
        console.error("Life Added!");
        gameInterface.lives += 1;
        itemAte.play(true);
        break;
    }
  }

  function characterMovement(): void {

    const moveSpeed: number = 8;

    let velocity: ƒ.Vector3 = ƒ.Vector3.ZERO();

    while (won != true) {
      if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D])) {
        velocity.x = moveSpeed;
      }
  
      if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A])) {
        velocity.x = -moveSpeed;
      }
  
      if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_UP, ƒ.KEYBOARD_CODE.W])) {
        velocity.z = -moveSpeed;
      }
  
      if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_DOWN, ƒ.KEYBOARD_CODE.S])) {
        velocity.z = moveSpeed;
      }
    }

    velocity.y = 0;

    //check if character stays still
    if (velocity.x == 0 && velocity.z == 0) {
      // console.log("x: " + velocity.x + ", z: " + velocity.z);
    } else {
      // console.log("x: " + velocity.x + ", z: " + velocity.z);
      cmpRigidbody.setVelocity(velocity);
    }

    cmpRigidbody.setRotation(ƒ.Vector3.ZERO())
  }

  function updateTimer(): void {
    gameInterface.time += 1;
  }

}
