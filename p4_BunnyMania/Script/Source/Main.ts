namespace Script {
  import ƒ = FudgeCore;
  import Vector3 = FudgeCore.Vector3;

  let viewport: ƒ.Viewport;
  let graph: ƒ.Node;
  let maze: ƒ.Node;
  export let items: ƒ.Node;
  let character: ƒ.Node;
  let cmpRigidbody: ƒ.ComponentRigidbody;

  let objectAte: number = 0;

  //@ts-ignore
  document.addEventListener("interactiveViewportStarted", start);

  async function start(_event: CustomEvent): Promise<void> {
    viewport = _event.detail;

    graph = viewport.getBranch();
    console.log(graph);

    maze = graph.getChildrenByName("Maze")[0];
    items = maze.getChildrenByName("Items")[0];
    const myMaze: Maze = new Maze(16, 16);

    character = graph.getChildrenByName("Character")[0];
    console.log(character);

    let cameraNode: ƒ.Node = character.getChildrenByName("Camera")[0];
    console.log(cameraNode);
    let camera: ƒ.ComponentCamera = cameraNode.getComponent(ƒ.ComponentCamera);
    console.log(camera);

    viewport.camera = camera;

    // Add stars and power-ups to the maze where there are no cubes
    myMaze.addItems();

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
    cmpRigidbody.mass = 3000;
    cmpRigidbody.friction = 2;
    cmpRigidbody.dampTranslation = 5;

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

    cmpRigidbody.setVelocity(velocity);
  }

  
}
