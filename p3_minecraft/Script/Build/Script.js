"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class Block extends ƒ.Node {
        static meshCube = new ƒ.MeshCube("Block");
        static mtrCube = new ƒ.Material("Block", ƒ.ShaderFlat, new ƒ.CoatRemissive());
        constructor(_position, _color) {
            super("Block");
            this.addComponent(new ƒ.ComponentMesh(Block.meshCube));
            let cmpMaterial = new ƒ.ComponentMaterial(Block.mtrCube);
            cmpMaterial.clrPrimary = _color;
            this.addComponent(cmpMaterial);
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position)));
        }
    }
    Script.Block = Block;
})(Script || (Script = {}));
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
    //@ts-ignore
    document.addEventListener("interactiveViewportStarted", start);
    async function start(_event) {
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
            let instance1 = new Script.Block(ƒ.Vector3.X(index), ƒ.Color.CSS("red"));
            viewport.getBranch().addChild(instance1);
        }
        // Schleife für Blöcke in Richtung Y-Achse
        for (let index = 0; index < 3; index++) {
            let instance1 = new Script.Block(ƒ.Vector3.Y(index), ƒ.Color.CSS("red"));
            viewport.getBranch().addChild(instance1);
        }
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        // ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map