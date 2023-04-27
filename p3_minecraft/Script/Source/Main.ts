namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  //@ts-ignore
  document.addEventListener("interactiveViewportStarted", start);

  async function start(_event: CustomEvent): Promise<void> {
    viewport = _event.detail;

    // let block: ƒ.Graph = <ƒ.Graph>ƒ.Project.resources["Graph|2023-04-24T14:18:06.025Z|47071"];
    // let instance: ƒ.GraphInstance = await ƒ.Project.createGraphInstance(block);
    // console.log(instance);
    // instance.mtxLocal.translateX(1);

    // let instanceArray: Block[];
    // instanceArray.length

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



    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    // ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  }

}