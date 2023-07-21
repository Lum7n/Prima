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
    //import Mesh = FudgeCore.Mesh;
    let TileType;
    (function (TileType) {
        TileType[TileType["Ground"] = 0] = "Ground";
        TileType[TileType["Border"] = 1] = "Border";
        TileType[TileType["Cube"] = 2] = "Cube";
        TileType[TileType["Empty"] = 3] = "Empty";
    })(TileType || (TileType = {}));
    let viewport;
    let graph;
    let maze;
    let character;
    let characterA;
    let cmpRigidbody;
    let isGrounded = false;
    //@ts-ignore
    document.addEventListener("interactiveViewportStarted", start);
    async function start(_event) {
        viewport = _event.detail;
        graph = viewport.getBranch();
        console.log(graph);
        maze = graph.getChildrenByName("Maze")[0];
        const myMaze = new Maze(16, 16);
        character = graph.getChildrenByName("Character")[0];
        console.log(character);
        let cameraNode = character.getChildrenByName("Camera")[0];
        console.log(cameraNode);
        let camera = cameraNode.getComponent(ƒ.ComponentCamera);
        console.log(camera);
        //viewport.camera = camera;
        viewport.camera = viewport.camera;
        // Add stars and power-ups to the maze where there are no cubes
        myMaze.addStarsAndPowerUps1();
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start();
        setUpCharacter();
        //loadMesh
    }
    // async function loadMesh(): Promise<void> {
    //   let meshURL: string = new URL(this.url.toString(), Project.baseURL).toString();
    //   try {
    //     const mesh: Mesh = await meshURL.load(meshURL);
    //     // Create a new node and add the loaded mesh as a component
    //     const node: ƒ.Node = new ƒ.Node("MeshNode");
    //     const cmpMesh: ƒ.ComponentMesh = new ƒ.ComponentMesh(mesh);
    //     // Optionally, you can also create a material and add it to the mesh
    //     const material: ƒ.Material = new ƒ.Material("Material", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(1, 0.5, 0.3, 1)));
    //     const cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(material);
    //     node.addComponent(cmpMaterial);
    //     // Position and scale the mesh node as needed
    //     const transform: ƒ.
    //     node.mtxLocal.translate();
    //     node.mtxLocal.scale(new Vector3(1, 1, 1));
    //     rabbit = new ƒ.Node("Rabbit");
    //     rabbit.addComponent(cmpMesh);
    //     rabbit.addComponent(cmpMaterial);
    //     rabbit.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(new Vector3(0, 0, 0))));
    //     viewport.getBranch().addChild(rabbit);
    //   } catch (error) {
    //     console.error("Error", error);
    //   }
    //}
    function update(_event) {
        characterMovement();
        ƒ.Physics.simulate(); // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function setUpCharacter() {
        characterA = viewport.getBranch().getChildrenByName("Character")[0];
        cmpRigidbody = characterA.getComponent(ƒ.ComponentRigidbody);
        cmpRigidbody.mass = 5;
        cmpRigidbody.friction = 0.8;
        cmpRigidbody.dampTranslation = 5;
        cmpRigidbody.addEventListener("ColliderEnteredCollision" /* ƒ.EVENT_PHYSICS.COLLISION_ENTER */, characterCollision);
    }
    function characterCollision(_event) {
        let vctCollision = ƒ.Vector3.DIFFERENCE(_event.collisionPoint, characterA.mtxWorld.translation);
        isGrounded = true;
        characterA.mtxWorld.translate(vctCollision);
    }
    function characterMovement() {
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D])) {
            cmpRigidbody.setVelocity(ƒ.Vector3.X(-5));
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A])) {
            cmpRigidbody.setVelocity(ƒ.Vector3.X(5));
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_UP, ƒ.KEYBOARD_CODE.W])) {
            cmpRigidbody.setVelocity(ƒ.Vector3.Z(5));
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_DOWN, ƒ.KEYBOARD_CODE.S])) {
            cmpRigidbody.setVelocity(ƒ.Vector3.Z(-5));
        }
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