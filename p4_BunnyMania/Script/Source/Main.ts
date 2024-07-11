namespace Script {
  import ƒ = FudgeCore;
  import Vector3 = FudgeCore.Vector3;
  console.log(Vector3);

  let viewport: ƒ.Viewport;
  let graph: ƒ.Node;
  let maze: ƒ.Node;
  let character: ƒ.Node;
  let cmpRigidbody: ƒ.ComponentRigidbody;
  export let items: ƒ.Node;
  let sound: ƒ.Node;
  export let life: ƒ.Node;
  export let life2: ƒ.Node;
  export let lifeCopy: ƒ.Node;


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
    life = items.getChildrenByName("Life")[0];


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
      case "PowerUp":
        score += 20;
        itemAte.play(true)
        break;
      case "Lifes":
        console.error("Life Added!");
        itemAte.play(true)
        break;
      case "AdditionalTime":
        score += 10;
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
