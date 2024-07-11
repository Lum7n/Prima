"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class AdditionalTime extends ƒ.Node {
        static meshPyramid = new ƒ.MeshPyramid("AdditionalTime");
        static mtrPyramid = new ƒ.Material("AdditionalTime", ƒ.ShaderFlat, new ƒ.CoatRemissive());
        constructor(_position, _scale) {
            super("AdditionalTime");
            this.addComponent(new ƒ.ComponentMesh(AdditionalTime.meshPyramid));
            let cmpMaterial = new ƒ.ComponentMaterial(AdditionalTime.mtrPyramid);
            cmpMaterial.clrPrimary = ƒ.Color.CSS("DarkSlateBlue");
            this.addComponent(cmpMaterial);
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position)));
            this.getComponent(ƒ.ComponentTransform).mtxLocal.scale(ƒ.Vector3.ONE(_scale));
            let cmpRigidbody = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.SPHERE);
            cmpRigidbody.isTrigger = true;
            this.addComponent(cmpRigidbody);
        }
    }
    Script.AdditionalTime = AdditionalTime;
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
    class Lifes extends ƒ.Node {
        // static meshCube: ƒ.MeshCube = new ƒ.MeshCube("Lifes");
        // static mtrCube: ƒ.Material = new ƒ.Material("Lifes", ƒ.ShaderFlat, new ƒ.CoatRemissive());
        constructor(_position, _scale) {
            super("Lifes");
            this.appendChild(Script.life);
            // this.addComponent(new ƒ.ComponentMesh(Lifes.meshCube));
            // let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(Lifes.mtrCube);
            // cmpMaterial.clrPrimary = ƒ.Color.CSS("LawnGreen");
            // this.addComponent(cmpMaterial);
            console.log(_position);
            // let cmpTransform: ƒ.ComponentTransform = 
            // cmpTransform.transform.
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position)));
            // this.getComponent(ƒ.ComponentTransform).mtxLocal.scale(ƒ.Vector3.ONE(_scale));
            let cmpRigidbody = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.SPHERE);
            cmpRigidbody.isTrigger = true;
            this.addComponent(cmpRigidbody);
        }
    }
    Script.Lifes = Lifes;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    var Vector3 = FudgeCore.Vector3;
    console.log(Vector3);
    let viewport;
    let graph;
    let maze;
    let character;
    let cmpRigidbody;
    let sound;
    let objectAte = 0;
    let score = 0;
    let starPling;
    let itemAte;
    //@ts-ignore
    document.addEventListener("interactiveViewportStarted", start);
    async function start(_event) {
        viewport = _event.detail;
        graph = viewport.getBranch();
        console.log(graph);
        maze = graph.getChildrenByName("Maze")[0];
        Script.items = maze.getChildrenByName("Items")[0];
        Script.life = Script.items.getChildrenByName("Life")[0];
        const myMaze = new Script.Maze(16, 16);
        // Add stars and power-ups to the maze where there are no cubes
        myMaze.addItems();
        character = graph.getChildrenByName("Character")[0];
        console.log(character);
        let cameraNode = character.getChildrenByName("Camera")[0];
        console.log(cameraNode);
        let camera = cameraNode.getComponent(ƒ.ComponentCamera);
        console.log(camera);
        viewport.camera = camera;
        sound = graph.getChildrenByName("Audio")[0];
        starPling = sound.getChildrenByName("Star")[0].getComponent(ƒ.ComponentAudio);
        itemAte = sound.getChildrenByName("otherItem")[0].getComponent(ƒ.ComponentAudio);
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start();
        setUpCharacter();
    }
    function update(_event) {
        characterMovement();
        ƒ.Physics.simulate(); // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function setUpCharacter() {
        cmpRigidbody = character.getComponent(ƒ.ComponentRigidbody);
        cmpRigidbody.mass = 2500;
        cmpRigidbody.friction = 2;
        cmpRigidbody.dampTranslation = 5;
        cmpRigidbody.effectRotation.y = 0;
        cmpRigidbody.addEventListener("TriggerEnteredCollision" /* ƒ.EVENT_PHYSICS.TRIGGER_ENTER */, collision);
    }
    function collision(_event) {
        console.log(_event.cmpRigidbody.node);
        let collidedWithObject = _event.cmpRigidbody.node;
        let objectParent = collidedWithObject.getParent();
        objectParent.removeChild(collidedWithObject);
        objectAte++;
        console.log(objectAte);
        if (objectAte == 169) {
            window.alert("You Won!");
        }
        switch (collidedWithObject.name) {
            case "Star":
                score += 50;
                starPling.play(true);
                console.log(score);
                break;
            case "PowerUp":
                score += 20;
                itemAte.play(true);
                break;
            case "Lifes":
                console.error("Life Added!");
                itemAte.play(true);
                break;
            case "AdditionalTime":
                score += 10;
                itemAte.play(true);
                break;
        }
    }
    function characterMovement() {
        const moveSpeed = 5;
        let velocity = ƒ.Vector3.ZERO();
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D])) {
            velocity.x = moveSpeed;
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A])) {
            velocity.x = -moveSpeed;
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_UP, ƒ.KEYBOARD_CODE.W])) {
            velocity.z = -moveSpeed;
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_DOWN, ƒ.KEYBOARD_CODE.S])) {
            velocity.z = moveSpeed;
        }
        velocity.y = 0;
        //check if character stays still
        if (velocity.x == 0 && velocity.z == 0) {
            console.log("x: " + velocity.x + ", z: " + velocity.z);
        }
        else {
            // console.log("x: " + velocity.x + ", z: " + velocity.z);
            cmpRigidbody.setVelocity(velocity);
        }
        cmpRigidbody.setRotation(ƒ.Vector3.ZERO());
    }
})(Script || (Script = {}));
var Script;
(function (Script) {
    var Vector3 = FudgeCore.Vector3;
    let ItemType;
    (function (ItemType) {
        ItemType[ItemType["Star"] = 0] = "Star";
        ItemType[ItemType["PowerUp"] = 1] = "PowerUp";
        ItemType[ItemType["Lifes"] = 2] = "Lifes";
        ItemType[ItemType["AdditionalTime"] = 3] = "AdditionalTime";
        ItemType[ItemType["Empty"] = 4] = "Empty";
    })(ItemType || (ItemType = {}));
    let TileType;
    (function (TileType) {
        TileType[TileType["Ground"] = 0] = "Ground";
        TileType[TileType["Border"] = 1] = "Border";
        TileType[TileType["Cube"] = 2] = "Cube";
        TileType[TileType["Empty"] = 3] = "Empty";
    })(TileType || (TileType = {}));
    let itemTypeArray = [];
    itemTypeArray[0] = 0;
    let itemNumber = 1;
    let previousItem = 0;
    let lastItem = ItemType.Empty;
    let itemScale = 0.5;
    class Maze {
        width;
        height;
        grid;
        constructor(_width, _height) {
            this.width = _width;
            this.height = _height;
            this.grid = this.createEmptyGrid();
        }
        createEmptyGrid() {
            const grid = [];
            for (let z = 0; z < this.width; z++) {
                const row = [];
                for (let x = 0; x < this.height; x++) {
                    row.push(TileType.Empty);
                }
                grid.push(row);
            }
            return grid;
        }
        addItems() {
            for (let z = 0; z < this.height; z++) {
                for (let x = 0; x < this.width; x++) {
                    if (this.grid[z][x] === TileType.Empty) {
                        let randomNumber = Math.random();
                        let itemType;
                        if (randomNumber <= 0.01) { // 1%
                            itemType = ItemType.Lifes;
                        }
                        else if (randomNumber <= 0.05) { // 4%
                            itemType = ItemType.PowerUp;
                        }
                        else if (randomNumber <= 0.12) { // 7%
                            itemType = ItemType.AdditionalTime;
                        }
                        else {
                            itemType = ItemType.Star;
                        }
                        // Checks for Vertical Duplicates
                        previousItem++;
                        if (itemNumber >= 17) {
                            if (itemType == itemTypeArray[previousItem]) {
                                itemType = ItemType.Star;
                            }
                            else {
                                //console.log("type:" + itemType);
                            }
                        }
                        itemTypeArray[previousItem] = itemType;
                        if (previousItem == 16) {
                            previousItem = 0;
                        }
                        itemNumber++;
                        // Checks for Horizontal Duplicates
                        if (lastItem == itemType) {
                            itemType = ItemType.Star;
                        }
                        lastItem = itemType;
                        // Add the item based on the itemType
                        switch (itemType) {
                            case ItemType.Star:
                                this.addStar(x, z);
                                break;
                            case ItemType.PowerUp:
                                this.addPowerUp(x, z);
                                break;
                            case ItemType.Lifes:
                                this.addLifes(x, z);
                                break;
                            case ItemType.AdditionalTime:
                                this.addAdditionalTime(x, z);
                                break;
                        }
                    }
                }
            }
        }
        addStar(x, z) {
            const star = new Script.Star(new Vector3(x, 0.5, z), itemScale);
            Script.items.addChild(star);
        }
        addPowerUp(x, z) {
            const powerUp = new Script.PowerUp(new Vector3(x, 0.5, z), itemScale);
            Script.items.addChild(powerUp);
        }
        addLifes(x, z) {
            const lifes = new Script.Lifes(new Vector3(x, 0, z), itemScale);
            Script.items.addChild(lifes);
        }
        addAdditionalTime(x, z) {
            const additionalTime = new Script.AdditionalTime(new Vector3(x, 0.5, z), itemScale);
            Script.items.addChild(additionalTime);
        }
    }
    Script.Maze = Maze;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class PowerUp extends ƒ.Node {
        static meshTorus = new ƒ.MeshTorus("PowerUp");
        static mtrTorus = new ƒ.Material("PowerUp", ƒ.ShaderFlat, new ƒ.CoatRemissive());
        constructor(_position, _scale) {
            super("PowerUp");
            this.addComponent(new ƒ.ComponentMesh(PowerUp.meshTorus));
            let cmpMaterial = new ƒ.ComponentMaterial(PowerUp.mtrTorus);
            cmpMaterial.clrPrimary = ƒ.Color.CSS("CornflowerBlue");
            this.addComponent(cmpMaterial);
            let cmpTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position));
            cmpTransform.mtxLocal.rotateX(90, false);
            this.addComponent(cmpTransform);
            this.getComponent(ƒ.ComponentTransform).mtxLocal.scale(ƒ.Vector3.ONE(_scale));
            let cmpRigidbody = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.SPHERE);
            cmpRigidbody.isTrigger = true;
            this.addComponent(cmpRigidbody);
        }
    }
    Script.PowerUp = PowerUp;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class Star extends ƒ.Node {
        static meshSphere = new ƒ.MeshSphere("Star");
        static mtrSphere = new ƒ.Material("Star", ƒ.ShaderFlat, new ƒ.CoatRemissive());
        constructor(_position, _scale) {
            super("Star");
            this.addComponent(new ƒ.ComponentMesh(Star.meshSphere));
            let cmpMaterial = new ƒ.ComponentMaterial(Star.mtrSphere);
            cmpMaterial.clrPrimary = ƒ.Color.CSS("Gold");
            this.addComponent(cmpMaterial);
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position)));
            this.getComponent(ƒ.ComponentTransform).mtxLocal.scale(ƒ.Vector3.ONE(_scale));
            let cmpRigidbody = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.SPHERE);
            cmpRigidbody.isTrigger = true;
            this.addComponent(cmpRigidbody);
        }
    }
    Script.Star = Star;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map