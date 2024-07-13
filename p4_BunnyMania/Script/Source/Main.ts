namespace Script {
  import ƒ = FudgeCore;
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

  let objectAte: number = 0;
  let score: number = 0;
  let starPling: ƒ.ComponentAudio;
  let itemAte: ƒ.ComponentAudio;

  //@ts-ignore
  document.addEventListener("interactiveViewportStarted", start);

  async function start(_event: CustomEvent): Promise<void> {
    viewport = _event.detail;

    graph = viewport.getBranch();
    console.log(graph);

    maze = graph.getChildrenByName("Maze")[0];
    items = maze.getChildrenByName("Items")[0];

    life1 = items.getChildrenByName("Life1")[0];
    life2 = items.getChildrenByName("Life2")[0];
    lifeArray[1] = (life1);
    lifeArray[2] = (life2);
    console.log(lifeArray);

    powerUp1 = items.getChildrenByName("PowerUp1")[0];
    powerUp2 = items.getChildrenByName("PowerUp2")[0];
    powerUp3 = items.getChildrenByName("PowerUp3")[0];
    powerUp4 = items.getChildrenByName("PowerUp4")[0];
    powerUpArray[1] = (powerUp1);
    powerUpArray[2] = (powerUp2);
    powerUpArray[3] = (powerUp3);
    powerUpArray[4] = (powerUp4);
    console.log(powerUpArray);

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

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();

    setUpCharacter();

  }

  function update(_event: Event): void {

    characterMovement();

    ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  function setUpCharacter(): void {

    cmpRigidbody = character.getComponent(ƒ.ComponentRigidbody);
    cmpRigidbody.mass = 2500;
    cmpRigidbody.friction = 2;
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
    if (objectAte == 169) {
      window.alert("You Won!");
    }

    switch (collidedWithObject.name) {

      case "Star":
        score += 50;
        starPling.play(true);
        console.log(score);
        break;
      case "AdditionalTime":
        // console.error("Added Time!");
        score += 10;
        itemAte.play(true)
        break;
      case "PowerUp":
        console.error("PowerUp Added!");
        score += 20;
        itemAte.play(true)
        break;
      case "Life":
        console.error("Life Added!");
        itemAte.play(true)
        break;
    }
  }

  function characterMovement(): void {

    const moveSpeed: number = 5;

    let velocity: ƒ.Vector3 = ƒ.Vector3.ZERO();

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

    velocity.y = 0;

    //check if character stays still
    if (velocity.x == 0 && velocity.z == 0) {
      console.log("x: " + velocity.x + ", z: " + velocity.z);
    } else {
      // console.log("x: " + velocity.x + ", z: " + velocity.z);
      cmpRigidbody.setVelocity(velocity);
    }

    cmpRigidbody.setRotation(ƒ.Vector3.ZERO())

  }

}
