"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(CustomComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* ƒ.EVENT.COMPONENT_ADD */:
                    ƒ.Debug.log(this.message, this.node);
                    break;
                case "componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
    }
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    let character;
    let gravity = -9.81;
    let ySpeed = 0;
    let isGrounded = true;
    document.addEventListener("interactiveViewportStarted", start);
    let graph;
    // let audioComponent = graph.getComponent(ƒ.ComponentAudio);
    // console.log(audioComponent);
    function start(_event) {
        viewport = _event.detail;
        graph = viewport.getBranch();
        character = graph.getChildrenByName("Character")[0];
        console.log(character);
        let cmpCamera = graph.getComponent(ƒ.ComponentCamera);
        viewport.camera = cmpCamera;
        let cmpListener = graph.getComponent(ƒ.ComponentAudioListener);
        ƒ.AudioManager.default.listenWith(cmpListener);
        ƒ.AudioManager.default.listenTo(graph);
        // // bekomme zugriff auf eine einzelne tile, Tile 1
        // let tile: ƒ.Node = graph.getChildrenByName("Terrain")[0].getChildren()[1];
        // // geo = gibt die postion der Tile in Längengrad und Breitengrad an
        // // ohne geo gibt es den Verlauf der Achsen der Tile aus
        // console.log(tile.mtxLocal.getX().geo.toString());
        // // setzt die Tile wieder auf Rotation 0, 0, 0
        // // tile.mtxLocal.rotation = ƒ.Vector3.ZERO();
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        let timeFrame = ƒ.Loop.timeFrameGame / 1000; // time since last frame in seconds
        // ƒ.Physics.simulate();  // if physics is included and used
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D]))
            character.mtxLocal.translateX(1 * timeFrame);
        if (isGrounded && ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])) {
            ySpeed = 5;
            isGrounded = false;
        }
        ySpeed += gravity * timeFrame;
        let pos = character.mtxLocal.translation;
        pos.y += ySpeed * timeFrame;
        let tileCollided = checkCollision(pos);
        if (tileCollided) {
            ySpeed = 0;
            pos.y = tileCollided.mtxWorld.translation.y + 0.5;
            isGrounded = true;
        }
        character.mtxLocal.translation = pos;
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function checkCollision(_posWorld) {
        let tiles = viewport.getBranch().getChildrenByName("Blocks")[0].getChildren();
        for (let tile of tiles) {
            let pos = ƒ.Vector3.TRANSFORMATION(_posWorld, tile.mtxWorldInverse, true);
            if (pos.y < 0.5 && pos.x > -0.5 && pos.x < 0.5)
                return tile;
            // console.log(pos);
        }
        return null;
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map