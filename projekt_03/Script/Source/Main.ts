namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let character: ƒ.Node;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);


  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    character = viewport.getBranch().getChildrenByName("Character")[0];
    console.log("Character:")
    console.log(character);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a

    let cmpCamera: ƒ.ComponentCamera = viewport.getBranch().getComponent(ƒ.ComponentCamera);
    viewport.camera = cmpCamera;

  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used

    // console.log(character);
    let floatArray = character.mtxWorld.get();
    // console.log(floatArray[13])

    if (floatArray[13] <= -1) {
      character.mtxLocal.translateY(1);

    } else {
      character.mtxLocal.translateY(-0.01);

    }


    // move to left or right via keys
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D]))
      character.mtxLocal.translateX(0.05);
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A]))
      character.mtxLocal.translateX(-0.05);
    viewport.draw();

    // ƒ.AudioManager.default.update();

  }
}
