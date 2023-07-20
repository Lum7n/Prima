"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class AdditionalTime extends ƒ.Node {
        static meshSphere = new ƒ.MeshSphere("AdditionalTime");
        static mtrSphere = new ƒ.Material("AdditionalTime", ƒ.ShaderFlat, new ƒ.CoatRemissive());
        constructor(_position) {
            super("AdditionalTime");
            this.addComponent(new ƒ.ComponentMesh(Script.Star.meshSphere));
            let cmpMaterial = new ƒ.ComponentMaterial(Script.Star.mtrSphere);
            cmpMaterial.clrPrimary = ƒ.Color.CSS("DarkSlateBlue");
            this.addComponent(cmpMaterial);
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position)));
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
    class Lives extends ƒ.Node {
        static meshSphere = new ƒ.MeshSphere("Lives");
        static mtrSphere = new ƒ.Material("Lives", ƒ.ShaderFlat, new ƒ.CoatRemissive());
        constructor(_position) {
            super("Lives");
            this.addComponent(new ƒ.ComponentMesh(Script.Star.meshSphere));
            let cmpMaterial = new ƒ.ComponentMaterial(Script.Star.mtrSphere);
            cmpMaterial.clrPrimary = ƒ.Color.CSS("LawnGreen");
            this.addComponent(cmpMaterial);
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position)));
        }
    }
    Script.Lives = Lives;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    var Vector3 = FudgeCore.Vector3;
    let character;
    let cmpRigidbody;
    let maze;
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        viewport = _event.detail;
        maze = viewport.getBranch().getChildrenByName("Maze")[0];
        const myMaze = new Maze(16, 16);
        // Add stars and power-ups to the maze where there are no cubes
        myMaze.addStarsAndPowerUps1();
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        // ƒ.Loop.start();  // start the game loop to continuously draw the viewport, update the audiosystem and drive the physics i/a
        character = viewport.getBranch().getChildrenByName("Character")[0];
        console.log(character);
        viewport.camera = character.getChild(0).getComponent(ƒ.ComponentCamera);
        cmpRigidbody = character.getComponent(ƒ.ComponentRigidbody);
        cmpRigidbody.effectRotation = ƒ.Vector3.Y();
    }
    function update(_event) {
        characterMovement();
        // ƒ.Physics.simulate();  // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    let ItemType;
    (function (ItemType) {
        ItemType[ItemType["Star"] = 0] = "Star";
        ItemType[ItemType["PowerUp"] = 1] = "PowerUp";
        ItemType[ItemType["Lives"] = 2] = "Lives";
        ItemType[ItemType["AdditionalTime"] = 3] = "AdditionalTime";
        ItemType[ItemType["Empty"] = 4] = "Empty";
    })(ItemType || (ItemType = {}));
    let itemTypeArray = [];
    itemTypeArray[0] = 0;
    let itemNumber = 1;
    let previousItem = 0;
    let lastItem = ItemType.Empty;
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
        addStarsAndPowerUps1() {
            for (let z = 0; z < this.height; z++) {
                for (let x = 0; x < this.width; x++) {
                    if (this.grid[z][x] === TileType.Empty) {
                        if (!isCollidingWithLevel1(x, z)) {
                            let randomNumber = Math.random();
                            let itemType;
                            if (randomNumber <= 0.01) { // 1%
                                itemType = ItemType.Lives;
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
                                case ItemType.Lives:
                                    this.addLives(x, z);
                                    break;
                                case ItemType.AdditionalTime:
                                    this.addAdditionalTime(x, z);
                                    break;
                            }
                        }
                    }
                }
            }
        }
        addStar(x, z) {
            const star = new Script.Star(new Vector3(x, 0.5, z));
            maze.addChild(star);
        }
        addPowerUp(x, z) {
            const powerUp = new Script.PowerUp(new Vector3(x, 0.5, z));
            maze.addChild(powerUp);
        }
        addLives(x, z) {
            const lives = new Script.Lives(new Vector3(x, 0.5, z));
            maze.addChild(lives);
        }
        addAdditionalTime(x, z) {
            const additionalTime = new Script.AdditionalTime(new Vector3(x, 0.5, z));
            maze.addChild(additionalTime);
        }
    }
    Script.Maze = Maze;
    function isCollidingWithLevel1(x, z) {
        let level1Node = maze.getChildrenByName("Level 1")[0];
        let childrenOfLevel1 = level1Node.getChildren();
        //let i: number = 0;
        for (let i = 0; i < childrenOfLevel1.length; i++) {
            //console.log(childrenOfLevel1);
            if (isColliding(new Vector3(x, 0.5, z), childrenOfLevel1[i].mtxLocal.translation) == true) {
                console.log(i);
                console.log(childrenOfLevel1[i]);
                return true;
                //new Vector3(0.5, 0.5, 0.5)
            }
        }
        //console.log(childrenOfLevel1[i])
        return false;
    }
    function isColliding(posA, posB) {
        const distance = -10; // Adjust this value depending on the size of the cubes or nodes
        //console.log(posA);
        let lengthDifference = posA.magnitude - posB.magnitude; // Magnitude = Length of Vector
        return lengthDifference <= distance;
    }
    let TileType;
    (function (TileType) {
        TileType[TileType["Ground"] = 0] = "Ground";
        TileType[TileType["Border"] = 1] = "Border";
        TileType[TileType["Cube"] = 2] = "Cube";
        TileType[TileType["Empty"] = 3] = "Empty";
    })(TileType || (TileType = {}));
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
    class PowerUp extends ƒ.Node {
        static meshSphere = new ƒ.MeshSphere("PowerUp");
        static mtrSphere = new ƒ.Material("PowerUp", ƒ.ShaderFlat, new ƒ.CoatRemissive());
        constructor(_position) {
            super("PowerUp");
            this.addComponent(new ƒ.ComponentMesh(Script.Star.meshSphere));
            let cmpMaterial = new ƒ.ComponentMaterial(Script.Star.mtrSphere);
            cmpMaterial.clrPrimary = ƒ.Color.CSS("CornflowerBlue");
            this.addComponent(cmpMaterial);
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position)));
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
        constructor(_position) {
            super("Star");
            this.addComponent(new ƒ.ComponentMesh(Star.meshSphere));
            let cmpMaterial = new ƒ.ComponentMaterial(Star.mtrSphere);
            cmpMaterial.clrPrimary = ƒ.Color.CSS("Gold");
            this.addComponent(cmpMaterial);
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position)));
        }
    }
    Script.Star = Star;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map