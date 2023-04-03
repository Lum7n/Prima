"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    let sonic;
    let gravity = -9.81;
    let ySpeed = 0;
    let isGrounded = true;
    document.addEventListener("interactiveViewportStarted", start);
    // document.addEventListener("keydown", hndKeyboard)
    function start(_event) {
        viewport = _event.detail;
        sonic = viewport.getBranch().getChildrenByName("Sonic")[0];
        console.log(sonic);
        let cmpCamera = viewport.getBranch().getComponent(ƒ.ComponentCamera);
        viewport.camera = cmpCamera;
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        let timeFrame = ƒ.Loop.timeFrameGame / 1000; // time since last frame in seconds
        // ƒ.Physics.simulate();  // if physics is included and used
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D]))
            sonic.mtxLocal.translateX(1 * timeFrame);
        if (isGrounded && ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])) {
            ySpeed = 5;
            isGrounded = false;
        }
        ySpeed += gravity * timeFrame;
        let pos = sonic.mtxLocal.translation;
        pos.y += ySpeed * timeFrame;
        if (pos.y < 0.5) {
            ySpeed = 0;
            pos.y = 0.5;
            isGrounded = true;
        }
        sonic.mtxLocal.translation = pos;
        viewport.draw();
        // ƒ.AudioManager.default.update();
    }
    // function hndKeyboard(_event: KeyboardEvent) {
    //   if (_event.code == )
    // }
})(Script || (Script = {}));
