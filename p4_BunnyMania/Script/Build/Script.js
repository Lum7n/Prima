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
    class Life extends ƒ.Node {
        constructor(_position, _index) {
            super("Life");
            console.log("Life " + _index);
            Script.lifeArray[_index].activate(true);
            this.appendChild(Script.lifeArray[_index]);
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position)));
            let cmpRigidbody = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.SPHERE);
            cmpRigidbody.isTrigger = true;
            this.addComponent(cmpRigidbody);
        }
    }
    Script.Life = Life;
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
    Script.itemAnimation = new ƒ.Animation;
    let life1;
    let life2;
    Script.lifeArray = [];
    let powerUp1;
    let powerUp2;
    let powerUp3;
    let powerUp4;
    Script.powerUpArray = [];
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
        life1 = Script.items.getChildrenByName("Life1")[0];
        life2 = Script.items.getChildrenByName("Life2")[0];
        Script.lifeArray[1] = (life1);
        Script.lifeArray[2] = (life2);
        console.log(Script.lifeArray);
        powerUp1 = Script.items.getChildrenByName("PowerUp1")[0];
        powerUp2 = Script.items.getChildrenByName("PowerUp2")[0];
        powerUp3 = Script.items.getChildrenByName("PowerUp3")[0];
        powerUp4 = Script.items.getChildrenByName("PowerUp4")[0];
        Script.powerUpArray[1] = (powerUp1);
        Script.powerUpArray[2] = (powerUp2);
        Script.powerUpArray[3] = (powerUp3);
        Script.powerUpArray[4] = (powerUp4);
        console.log(Script.powerUpArray);
        // itemAnimation.idResource = "Animation|2023-07-21T22:24:47.000Z|55709";
        // console.log(itemAnimation);
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
            case "AdditionalTime":
                // console.error("Added Time!");
                score += 10;
                itemAte.play(true);
                break;
            case "PowerUp":
                console.error("PowerUp Added!");
                score += 20;
                itemAte.play(true);
                break;
            case "Life":
                console.error("Life Added!");
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
        ItemType[ItemType["Life"] = 2] = "Life";
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
    let indexLife = 1;
    let indexPowerUp = 1;
    let indexAddTime = 1;
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
                        if (randomNumber <= 0.008 && indexLife <= 2) { // 0,8%
                            itemType = ItemType.Life;
                        }
                        else if (randomNumber <= 0.017 && indexPowerUp <= 4) { // 1,7%
                            itemType = ItemType.PowerUp;
                        }
                        else if (randomNumber <= 0.049 && indexAddTime <= 12) { // 4,8%
                            itemType = ItemType.AdditionalTime;
                        }
                        else {
                            itemType = ItemType.Star;
                        }
                        // Checks for vertical Duplicates
                        previousItem++;
                        if (itemNumber >= 17) {
                            if (itemType == itemTypeArray[previousItem]) {
                                itemType = ItemType.Star;
                            }
                        }
                        itemTypeArray[previousItem] = itemType;
                        if (previousItem == 16) {
                            previousItem = 0;
                        }
                        itemNumber++;
                        // Checks for horizontal Duplicates
                        if (lastItem == itemType) {
                            itemType = ItemType.Star;
                        }
                        lastItem = itemType;
                        // Checks if the last Item is Type Life
                        if (itemNumber == 256 && itemType == ItemType.Life) {
                            itemType = ItemType.Star;
                        }
                        lastItem = itemType;
                        // Add the item based on the itemType
                        switch (itemType) {
                            case ItemType.Star:
                                this.addStar(x, z);
                                break;
                            case ItemType.AdditionalTime:
                                this.addAdditionalTime(x, z);
                                break;
                            case ItemType.PowerUp:
                                this.addPowerUp(x, z);
                                break;
                            case ItemType.Life:
                                this.addLifes(x, z);
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
        addAdditionalTime(x, z) {
            const additionalTime = new Script.AdditionalTime(new Vector3(x, 0.5, z), itemScale);
            indexAddTime++;
            Script.items.addChild(additionalTime);
        }
        addPowerUp(x, z) {
            const powerUp = new Script.PowerUp(new Vector3(x, 0, z), indexPowerUp);
            indexPowerUp++;
            Script.items.addChild(powerUp);
        }
        addLifes(x, z) {
            const life = new Script.Life(new Vector3(x, 0, z), indexLife);
            indexLife++;
            Script.items.addChild(life);
        }
    }
    Script.Maze = Maze;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class PowerUp extends ƒ.Node {
        constructor(_position, _index) {
            super("PowerUp");
            console.log("PowerUp " + _index);
            Script.powerUpArray[_index].activate(true);
            this.appendChild(Script.powerUpArray[_index]);
            // let cmpTransform: ƒ.ComponentTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position));
            // cmpTransform.mtxLocal.rotateX(90, false)
            // this.addComponent(cmpTransform);
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position)));
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