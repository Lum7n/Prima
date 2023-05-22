namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  export let viewport: ƒ.Viewport;
  export let blocks: ƒ.Node
  export let grid: Block[][][] = [];
  let character: ƒ.Node;
  let cmpRigidbody: ƒ.ComponentRigidbody;
  // let isGrounded: boolean;


  //@ts-ignore
  document.addEventListener("interactiveViewportStarted", start);

  async function start(_event: Event): Promise<void> {
    viewport = (<CustomEvent>_event).detail;
    viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.COLLIDERS;

    createBody;
    generateWorld(8, 6, 8);
    // generateWorld(6, 8, 6)

    let pickAlgorithm = [pickByComponent, pickByCamera, pickByDistance, pickByGrid];

    viewport.canvas.addEventListener("pointerdown", pickAlgorithm[1]);
    viewport.getBranch().addEventListener("pointerdown", <ƒ.EventListenerUnified>hitComponent);
    viewport.getBranch().addEventListener("characterCollided", (_event: Event) => console.log(_event))

    character = viewport.getBranch().getChildrenByName("Character")[0];
    console.log(character);
    viewport.camera = character.getChild(0).getComponent(ƒ.ComponentCamera);
    cmpRigidbody = character.getComponent(ƒ.ComponentRigidbody);
    cmpRigidbody.effectRotation = ƒ.Vector3.Y();
    // addEventListener.; // für collision

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {

    characterMovement();
    // cmpRigidbody.applyForce(ƒ.Vector3.Z(1));

    ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  // function characterCollision(_event: ƒ.EventPhysics): void {
  //   // let vctCollision: ƒ.Vector3 = ƒ.Vector3.DIFFERENCE(_event.collisionPoint, character.mtxWorld.translation);
  //   // if (vctCollision.x == 0 && vctCollision)
  //   isGrounded = true;

  //   //damit das event bei einem Elternteil ankommt, auch wenn sich andere kinder dazwischen schieben, die hirarchie verändert wurde
  //   let CustomEvent: CustomEvent = new CustomEvent("characterCollided", {bubbles: true, detail: character.mtxWorld.translation})
  //   character.dispatchEvent(CustomEvent);
  // }

  function createBody(): void {

  }

  function generateWorld(_width: number, _height: number, _depth: number): void {
    blocks = new ƒ.Node("Blocks");
    viewport.getBranch().addChild(blocks);
    // let vctOffset: ƒ.Vector2 = new ƒ.Vector2(Math.floor(_width / 2), Math.floor(_depth / 2));
    let vctOffset: ƒ.Vector2 = ƒ.Vector2.ZERO();

    for (let y: number = 0; y < _height; y++) {
      grid[y] = [];
      for (let z: number = 0; z < _depth; z++) {
        grid[y][z] = [];
        for (let x: number = 0; x < _width; x++) {
          let vctPostion: ƒ.Vector3 = new ƒ.Vector3(x - vctOffset.x, y, z - vctOffset.y);
          let txtColor = ƒ.Random.default.getElement(["DarkOliveGreen", "DarkKhaki", "DarkSalmon", "IndianRed", "OliveDrab", "Salmon"]);
          let block: Block = new Block(vctPostion, ƒ.Color.CSS(txtColor));
          block.name = vctPostion.toString() + "|" + txtColor;
          blocks.addChild(block);
          grid[y][z][x] = block;
        }
      }
    }
    console.log(grid);

    // einen Block hinzufügen
    // let instance1: Block = new Block(ƒ.Vector3.X(1), ƒ.Color.CSS("red"));
    // console.log(instance);
    // viewport.getBranch().addChild(instance1);

    // // Schleife für 3 Blöcke in Richtung X-Achse
    // for (let index = 0; index < 3; index++) {
    //   let instance1: Block = new Block(ƒ.Vector3.X(index), ƒ.Color.CSS("red"));
    //   viewport.getBranch().addChild(instance1);
    // }
  }

  function characterMovement(): void {

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D])) {
      cmpRigidbody.setVelocity(ƒ.Vector3.X(-5))
    }

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A])) {
      cmpRigidbody.setVelocity(ƒ.Vector3.X(5))
    }
    
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W])) {
      cmpRigidbody.setVelocity(ƒ.Vector3.Z(5))
    }

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S])) {
      cmpRigidbody.setVelocity(ƒ.Vector3.Z(-5))
    }
  }

}
