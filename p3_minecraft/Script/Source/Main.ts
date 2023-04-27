namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  //@ts-ignore
  document.addEventListener("interactiveViewportStarted", start);

  async function start(_event: CustomEvent): Promise<void> {
    viewport = _event.detail;

    // einen Block hinzufügen
    // let instance1: Block = new Block(ƒ.Vector3.X(1), ƒ.Color.CSS("red"));
    // console.log(instance);
    // viewport.getBranch().addChild(instance1);

    // Schleife für 3 Blöcke in Richtung X-Achse
    for (let index = 0; index < 3; index++) {
      let instance1: Block = new Block(ƒ.Vector3.X(index), ƒ.Color.CSS("red"));
      viewport.getBranch().addChild(instance1);
    }
    // Schleife für Blöcke in Richtung Y-Achse
    for (let index = 0; index < 3; index++) {
      let instance1: Block = new Block(ƒ.Vector3.Y(index), ƒ.Color.CSS("red"));
      viewport.getBranch().addChild(instance1);
    }

    viewport.canvas.addEventListener("mousedown", constructRay);
    viewport.getBranch().addEventListener("mousedown", <ƒ.EventListenerUnified>hit);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    // ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  function constructRay (_event: MouseEvent): void {
    viewport.getRayFromClient(new ƒ.Vector2(_event.clientX, _event.clientY));
    console.log(_event.clientX, _event.clientY)
  }

  function pick(_event: MouseEvent): void {
    console.log("pick")
    viewport.dispatchPointerEvent(<PointerEvent>_event);
  }

  function hit(_event: PointerEvent): void {
    let node: ƒ.Node = (<ƒ.Node>_event.target);
    let cmpPick: ƒ.ComponentPick = node.getComponent(ƒ.ComponentPick);
    console.log(cmpPick);
  }

  // function getDistance(_target: ƒ.Vector3): ƒ.Vector3 {

  //   console.log(_target);

  //   // return ƒ.Vector3
  // }

}
