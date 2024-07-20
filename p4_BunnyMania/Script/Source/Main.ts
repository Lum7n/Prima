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
  let character: ƒ.Node;
  let cmpRigidbody: ƒ.ComponentRigidbody;
  let sound: ƒ.Node;

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

  export let won: boolean = false;

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
    foes = maze.getChildrenByName("Foes")[0];

    const myMaze: Maze = new Maze(16, 16);
    // Add stars and power-ups to the maze where there are no cubes
    myMaze.addItems();
    for (let index = 0; index < 5; index++) {
      myMaze.addFoes();
    }

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
    initialLivesAmount = externalConfig["initialLivesAmount"];
    console.log("initial:" + initialLivesAmount);

    // gameState = new GameState(gameDuration);
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
    console.log(collidedWithObject.name);

    // try to fix the rotation
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
      case "Fox":
        console.log("Fox");
        break;
      case "Key":
        console.log("Key");
        won = true;
        timer.active = false;
        let finalPoints: number = gameInterface.points;
        let finalTime: number = gameInterface.time;
        console.log("final: " + finalPoints + " and " + finalTime);
        gameInterface.showEndscreen(finalPoints, finalTime);
        break;
    }
    // won?
    if (objectAte == 10) { //170
      console.log("whuu");
      showKey();
    }
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
