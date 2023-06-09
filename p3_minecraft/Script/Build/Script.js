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
            let cmpPick = new ƒ.ComponentPick();
            cmpPick.pick = ƒ.PICK.CAMERA;
            this.addComponent(cmpPick);
            let cmpRigidbody = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE);
            this.addComponent(cmpRigidbody);
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
    Script.grid = [];
    let character;
    let cmpRigidbody;
    let isGrounded;
    //@ts-ignore
    document.addEventListener("interactiveViewportStarted", start);
    async function start(_event) {
        Script.viewport = _event.detail;
        Script.viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.COLLIDERS;
        generateWorld(8, 6, 8);
        // generateWorld(6, 8, 6)
        let pickAlgorithm = [Script.pickByComponent, Script.pickByCamera, Script.pickByDistance, Script.pickByGrid];
        Script.viewport.canvas.addEventListener("pointerdown", pickAlgorithm[1]);
        Script.viewport.getBranch().addEventListener("pointerdown", Script.hitComponent);
        Script.viewport.getBranch().addEventListener("characterCollided", (_event) => console.log(_event));
        character = Script.viewport.getBranch().getChildrenByName("Character")[0];
        console.log(character);
        Script.viewport.camera = character.getChild(0).getComponent(ƒ.ComponentCamera);
        cmpRigidbody = character.getComponent(ƒ.ComponentRigidbody);
        cmpRigidbody.effectRotation = ƒ.Vector3.Y();
        // addEventListener.; // für collision
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        characterMovement();
        // cmpRigidbody.applyForce(ƒ.Vector3.Z(1));
        ƒ.Physics.simulate(); // if physics is included and used
        Script.viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function characterCollision(_event) {
        // let vctCollision: ƒ.Vector3 = ƒ.Vector3.DIFFERENCE(_event.collisionPoint, character.mtxWorld.translation);
        // if (vctCollision.x == 0 && vctCollision)
        isGrounded = true;
        //damit das event bei einem Elternteil ankommt, auch wenn sich andere kinder dazwischen schieben, die hirarchie verändert wurde
        let CustomEvent = new CustomEvent("characterCollided", { bubbles: true, detail: character.mtxWorld.translation });
        character.dispatchEvent(CustomEvent);
    }
    function generateWorld(_width, _height, _depth) {
        Script.blocks = new ƒ.Node("Blocks");
        Script.viewport.getBranch().addChild(Script.blocks);
        // let vctOffset: ƒ.Vector2 = new ƒ.Vector2(Math.floor(_width / 2), Math.floor(_depth / 2));
        let vctOffset = ƒ.Vector2.ZERO();
        for (let y = 0; y < _height; y++) {
            Script.grid[y] = [];
            for (let z = 0; z < _depth; z++) {
                Script.grid[y][z] = [];
                for (let x = 0; x < _width; x++) {
                    let vctPostion = new ƒ.Vector3(x - vctOffset.x, y, z - vctOffset.y);
                    let txtColor = ƒ.Random.default.getElement(["DarkOliveGreen", "DarkKhaki", "DarkSalmon", "IndianRed", "OliveDrab", "Salmon"]);
                    let block = new Script.Block(vctPostion, ƒ.Color.CSS(txtColor));
                    block.name = vctPostion.toString() + "|" + txtColor;
                    Script.blocks.addChild(block);
                    Script.grid[y][z][x] = block;
                }
            }
        }
        console.log(Script.grid);
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
    function characterMovement() {
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D])) {
            cmpRigidbody.setVelocity(ƒ.Vector3.X(-5));
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A])) {
            cmpRigidbody.setVelocity(ƒ.Vector3.X(5));
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W])) {
            cmpRigidbody.setVelocity(ƒ.Vector3.Z(5));
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S])) {
            cmpRigidbody.setVelocity(ƒ.Vector3.Z(-5));
        }
    }
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    function pickByComponent(_event) {
        console.log("pickByComponent");
        Reflect.set(_event, "closestDistance", Infinity);
        Reflect.set(_event, "closestBlock", null);
        Script.viewport.dispatchPointerEvent(_event);
        hitBlock(Reflect.get(_event, "closestBlock"));
    }
    Script.pickByComponent = pickByComponent;
    function hitComponent(_event) {
        let block = _event.target;
        let closestDistance = Reflect.get(_event, "closestDistance");
        let pick = Reflect.get(_event, "pick");
        if (pick.zBuffer < closestDistance) {
            Reflect.set(_event, "closestDistance", pick.zBuffer);
            Reflect.set(_event, "closestBlock", block);
        }
    }
    Script.hitComponent = hitComponent;
    function pickByCamera(_event) {
        console.log("pickCamera");
        let picks = ƒ.Picker.pickViewport(Script.viewport, new ƒ.Vector2(_event.clientX, _event.clientY));
        console.log(_event.button);
        if (_event.button == 1) {
            console.log("middle");
            picks.sort((_a, _b) => _a.zBuffer < _b.zBuffer ? -1 : 1);
            hitBlock(picks[0]?.node);
        }
        else if (_event.button == 0) {
            console.log("left");
            addBlock(picks[0]?.node);
        }
    }
    Script.pickByCamera = pickByCamera;
    function pickByDistance(_event) {
        console.log("pickByRay");
        let ray = Script.viewport.getRayFromClient(new ƒ.Vector2(_event.clientX, _event.clientY));
        let shortest;
        let found = null;
        let compare = Math.pow(0.7, 2);
        for (let block of Script.blocks.getChildren()) {
            if (compare < ray.getDistance(block.mtxWorld.translation).magnitudeSquared)
                continue;
            let distance = ƒ.Vector3.DIFFERENCE(block.mtxWorld.translation, ray.origin).magnitudeSquared;
            if (shortest == undefined || distance < shortest) {
                shortest = distance;
                found = block;
            }
        }
        hitBlock(found);
    }
    Script.pickByDistance = pickByDistance;
    function pickByGrid(_event) {
        console.log("pickByGrid");
        let ray = Script.viewport.getRayFromClient(new ƒ.Vector2(_event.clientX, _event.clientY));
        let posCheck = ray.origin.clone;
        let vctStep = ray.direction.clone;
        // find largest component value
        let largest = vctStep.get().reduce((_p, _c) => Math.max(_p, Math.abs(_c)));
        // normalize to 1 in that direction
        vctStep.scale(1 / largest);
        for (let i = 0; i < 100; i++) {
            posCheck.add(vctStep);
            let posGrid = posCheck.map(_value => Math.round(_value));
            console.log(posGrid.toString(), posCheck.toString());
            try {
                let block = Script.grid[posGrid.y][posGrid.z][posGrid.x];
                if (block) {
                    hitBlock(block);
                    return;
                }
            }
            catch (_e) { }
        }
    }
    Script.pickByGrid = pickByGrid;
    function hitBlock(_block) {
        if (!_block)
            return;
        console.log(_block.name);
        _block.getParent().removeChild(_block);
        Script.viewport.draw();
    }
    function addBlock(_block) {
        let posOldBlock = new ƒ.Vector3(_block.mtxWorld.translation.x, _block.mtxWorld.translation.y, _block.mtxWorld.translation.z);
        console.log(posOldBlock);
        let posNewBlock = new ƒ.Vector3(_block.mtxWorld.translation.x + 1, _block.mtxWorld.translation.y + 1, _block.mtxWorld.translation.z + 1);
        console.log(posNewBlock);
        let txtColor = ƒ.Random.default.getElement(["DarkOliveGreen", "DarkKhaki", "DarkSalmon", "IndianRed", "OliveDrab", "Salmon"]);
        let newBlock = new Script.Block(posNewBlock, ƒ.Color.CSS(txtColor));
        newBlock.name = posNewBlock.toString() + "|" + txtColor;
        console.log(newBlock);
        _block.getParent().addChild(newBlock);
        // viewport.getBranch().addChild(newBlock);
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map