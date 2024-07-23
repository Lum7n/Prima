namespace Script {
  import ƒ = FudgeCore;
  // import ƒAid = FudgeAid;
  import Vector3 = FudgeCore.Vector3;
  console.log(Vector3);

  let viewport: ƒ.Viewport;
  let graph: ƒ.Node;
  let maze: ƒ.Node;
  export let items: ƒ.Node;
  export let foes: ƒ.Node;
  export let character: ƒ.Node;
  let cmpRigidbody: ƒ.ComponentRigidbody;
  let modeMachine: ModeSwitch;
  let sound: ƒ.Node;

  export interface ExternalData {
    [name: string]: TileType[];
  }
  export let externalConfig: ExternalData;
  export let row0: TileType[];
  export let row1: TileType[];
  export let row2: TileType[];
  export let row3: TileType[];
  export let row4: TileType[];
  export let row5: TileType[];
  export let row6: TileType[];
  export let row7: TileType[];
  export let row8: TileType[];
  export let row9: TileType[];
  export let row10: TileType[];
  export let row11: TileType[];
  export let row12: TileType[];
  export let row13: TileType[];
  export let row14: TileType[];
  export let row15: TileType[];

  export let initialLivesAmount: number = 3;
  export let modeIndex: number = 4;
  let starAte: number = 0;
  let gameInterface: GameInterface;
  let starPling: ƒ.ComponentAudio;
  let itemAte: ƒ.ComponentAudio;

  export let won: boolean = false;
  let timeout: boolean = false;

  let gameTime: ƒ.Time;
  export let timer: ƒ.Timer;

  //@ts-ignore
  document.addEventListener("interactiveViewportStarted", start);

  async function start(_event: CustomEvent): Promise<void> {
    viewport = _event.detail;

    graph = viewport.getBranch();
    // console.log("Graph: " + graph);

    await getExternalData();

    maze = graph.getChildrenByName("Maze")[0];
    items = maze.getChildrenByName("Items")[0];
    foes = maze.getChildrenByName("Foes")[0];

    const myMaze: Maze = new Maze(16, 16);
    // Add stars and power-ups to the maze where there are no cubes
    myMaze.addItems();
    for (let index = 0; index < 5; index++) {
      myMaze.addFoes();
    }

    console.log(new DeterminePositions(1, 1));

    character = graph.getChildrenByName("Character")[0];
    console.log("Character: " + character);

    let cameraNode: ƒ.Node = character.getChildrenByName("Camera")[0];
    // console.log(cameraNode);
    let camera: ƒ.ComponentCamera = cameraNode.getComponent(ƒ.ComponentCamera);
    console.log("Camera: " + camera);

    viewport.camera = camera;
    sound = graph.getChildrenByName("Audio")[0];
    starPling = sound.getChildrenByName("Star")[0].getComponent(ƒ.ComponentAudio);
    itemAte = sound.getChildrenByName("otherItem")[0].getComponent(ƒ.ComponentAudio);

    gameTime = new ƒ.Time();
    timer = new ƒ.Timer(gameTime, 1000, 0, updateTimer);

    setUpCharacter();

    gameInterface = new GameInterface(initialLivesAmount);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics
  }

  function update(_event: Event): void {

    gameInterface.updateUserInterface();

    characterMovement();

    ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();

    ƒ.AudioManager.default.update();
  }

  async function getExternalData(): Promise<void> {
    let response: Response = await fetch("External.json");
    externalConfig = await response.json();
    row0 = externalConfig["z0"];
    row1 = externalConfig["z1"];
    row2 = externalConfig["z2"];
    row3 = externalConfig["z3"];
    row4 = externalConfig["z4"];
    row5 = externalConfig["z5"];
    row6 = externalConfig["z6"];
    row7 = externalConfig["z7"];
    row8 = externalConfig["z8"];
    row9 = externalConfig["z9"];
    row10 = externalConfig["z10"];
    row11 = externalConfig["z11"];
    row12 = externalConfig["z12"];
    row13 = externalConfig["z13"];
    row14 = externalConfig["z14"];
    row15 = externalConfig["z15"];
  }

  function setUpCharacter(): void {

    cmpRigidbody = character.getComponent(ƒ.ComponentRigidbody);
    cmpRigidbody.mass = 8000;
    cmpRigidbody.friction = 10;
    cmpRigidbody.dampTranslation = 5;
    cmpRigidbody.dampRotation = 1000;
    cmpRigidbody.effectRotation.x = 0;
    cmpRigidbody.effectRotation.y = 0;
    cmpRigidbody.effectRotation.z = 0;
    cmpRigidbody.addEventListener(ƒ.EVENT_PHYSICS.TRIGGER_ENTER, collision);

    modeMachine = new ModeSwitch();
    character.addComponent(modeMachine);
    modeMachine.stateCurrent = JOB.NORMAL;
    // console.log(modeMachine.stateCurrent)
  }

  function collision(_event: ƒ.EventPhysics): void {

    // console.log(_event.cmpRigidbody.node);
    let collidedWithObject: ƒ.Node = _event.cmpRigidbody.node;

    // try to fix the rotation
    character.mtxLocal.rotation = new ƒ.Vector3(0, 0, 0);
    character.mtxWorld.rotation = new ƒ.Vector3(0, 0, 0);
    cmpRigidbody.effectRotation.y = 0;
    cmpRigidbody.dampRotation = 1000;
    // console.log("Local " + character.mtxLocal.rotation);
    // console.log("World " + character.mtxWorld.rotation);

    //check the object and adds points, lives, sounds
    console.log(collidedWithObject.name);
    switch (collidedWithObject.name) {

      case "Star":
        starAte++;
        gameInterface.points += 20;
        starPling.play(true);
        break;
      case "AdditionalTime":
        gameInterface.points += 5;
        gameInterface.time -= 5;
        itemAte.play(true);
        break;
      case "PowerUp":
        gameInterface.points += 10;
        itemAte.play(true);
        modeMachine.transit(JOB.POWER);

        if (timeout == false) {
          setTimeout(afterPowerMode, 5000);
        } else if (timeout == true) {
          setTimeout(afterPowerMode, 5000);
        }
        timeout = true;
        break;
      case "Life":
        gameInterface.lives += 1;
        itemAte.play(true);
        break;
      case "Fox":
        break;
      case "Key":
        won = true;
        timer.active = false;
        let finalPoints: number = gameInterface.points;
        let finalTime: number = gameInterface.time;
        console.log("final: " + finalPoints + " and " + finalTime);
        gameInterface.showEndscreen(finalPoints, finalTime);
        break;
    }

    // won?
    if (starAte == indexStar) { //175
      showKey();
    }

    // if the Fox is killable
    if (collidedWithObject.name == "Fox") {
      if (modeMachine.stateCurrent == 0) { // NORMAL MODE
        console.log("Victim");
        gameInterface.lives -= 1;

      } else if (modeMachine.stateCurrent == 1) { // POWER MODE
        console.log("Fox-Killer");
        let objectParent: ƒ.Node = collidedWithObject.getParent();
        objectParent.removeChild(collidedWithObject);
      }
    } else {
      let objectParent: ƒ.Node = collidedWithObject.getParent();
      objectParent.removeChild(collidedWithObject);
    }
  }

  function afterPowerMode(): void {
    modeMachine.transit(JOB.NORMAL);
    timeout = false;
  }

  function showKey(): void {
    let key: ƒ.Node = items.getChildrenByName("Key")[0];

    key.activate(true);

    key.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(9, 0, 8))));

    let cmpRigidbody: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.SPHERE);
    cmpRigidbody.isTrigger = true;
    key.addComponent(cmpRigidbody)

    items.appendChild(key);
  }

  function characterMovement(): void {

    const moveSpeed: number = 10;

    let velocity: ƒ.Vector3 = ƒ.Vector3.ZERO();

    if (won != true) {
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
