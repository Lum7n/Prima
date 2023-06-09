namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let character: ƒ.Node;
  let gravity: number = -9.81;
  let ySpeed: number = 0;
  let isGrounded: boolean = true;

  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  let graph: ƒ.Graph;

  let audioComponent;


  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    graph = <ƒ.Graph>viewport.getBranch();

    character = graph.getChildrenByName("Character")[0];
    console.log(character);

    let cmpCamera: ƒ.ComponentCamera = graph.getComponent(ƒ.ComponentCamera);
    viewport.camera = cmpCamera;

    let cmpListener: ƒ.ComponentAudioListener = graph.getComponent(ƒ.ComponentAudioListener);

    ƒ.AudioManager.default.listenWith(cmpListener);
    ƒ.AudioManager.default.listenTo(graph);

    // // bekomme zugriff auf eine einzelne tile, Tile 1
    // let tile: ƒ.Node = graph.getChildrenByName("Terrain")[0].getChildren()[1];
    // // geo = gibt die postion der Tile in Längengrad und Breitengrad an
    // // ohne geo gibt es den Verlauf der Achsen der Tile aus
    // console.log(tile.mtxLocal.getX().geo.toString());
    // // setzt die Tile wieder auf Rotation 0, 0, 0
    // // tile.mtxLocal.rotation = ƒ.Vector3.ZERO();

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    let timeFrame: number = ƒ.Loop.timeFrameGame / 1000; // time since last frame in seconds
    // ƒ.Physics.simulate();  // if physics is included and used
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D]))
      character.mtxLocal.translateX(1 * timeFrame);
    if (isGrounded && ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])) {
      ySpeed = 5;
      isGrounded = false;

//hier bin ich

      // audioComponent = graph.getComponent(ƒ.ComponentAudio);
      // console.log(audioComponent);
    }

    ySpeed += gravity * timeFrame;
    let pos: ƒ.Vector3 = character.mtxLocal.translation;
    pos.y += ySpeed * timeFrame;

    let tileCollided: ƒ.Node = checkCollision(pos);
    if (tileCollided) {
      ySpeed = 0;
      pos.y = tileCollided.mtxWorld.translation.y + 0.5;
      isGrounded = true;
    }
    character.mtxLocal.translation = pos;

    viewport.draw();
    ƒ.AudioManager.default.update();



  }

  function checkCollision(_posWorld: ƒ.Vector3): ƒ.Node {
    let tiles: ƒ.Node[] = viewport.getBranch().getChildrenByName("Blocks")[0].getChildren()
    for (let tile of tiles) {
      let pos: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(_posWorld, tile.mtxWorldInverse, true);
      if (pos.y < 0.5 && pos.x > -0.5 && pos.x < 0.5)
        return tile;
      // console.log(pos);
    }

    return null;
  }

}

