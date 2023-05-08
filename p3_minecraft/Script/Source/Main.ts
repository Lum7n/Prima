namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  export let viewport: ƒ.Viewport;
  export let blocks: ƒ.Node
  export let grid: Block[][][] = [];
  let character: ƒ.Node;
  let cmpRigidbody: ƒ.ComponentRigidbody;


  //@ts-ignore
  document.addEventListener("interactiveViewportStarted", start);

  async function start(_event: Event): Promise<void> {
    viewport = (<CustomEvent>_event).detail;
    viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.COLLIDERS;

    generateWorld(8, 6, 8);
    // generateWorld(6, 8, 6)

    let pickAlgorithm = [pickByComponent, pickByCamera, pickByDistance, pickByGrid];

    // einen Block hinzufügen
    // let instance1: Block = new Block(ƒ.Vector3.X(1), ƒ.Color.CSS("red"));
    // console.log(instance);
    // viewport.getBranch().addChild(instance1);

    // // Schleife für 3 Blöcke in Richtung X-Achse
    // for (let index = 0; index < 3; index++) {
    //   let instance1: Block = new Block(ƒ.Vector3.X(index), ƒ.Color.CSS("red"));
    //   viewport.getBranch().addChild(instance1);
    // }

    viewport.canvas.addEventListener("pointerdown", pickAlgorithm[1]);
    viewport.getBranch().addEventListener("pointerdown", <ƒ.EventListenerUnified>hitComponent);

    character = viewport.getBranch().getChildrenByName("Character")[0];
    console.log(character);
    viewport.camera = character.getComponent(ƒ.ComponentCamera);
    cmpRigidbody = character.getComponent(ƒ.ComponentRigidbody);
    cmpRigidbody.effectRotation = ƒ.Vector3.Y();

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {

    cmpRigidbody.applyForce(ƒ.Vector3.Z(1));

    ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
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
  }

}
