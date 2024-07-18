"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class AdditionalTime extends ƒ.Node {
        static meshPyramid = new ƒ.MeshPyramid("AdditionalTime");
        static mtrPyramid = new ƒ.Material("AdditionalTime", ƒ.ShaderFlatTextured, new ƒ.CoatRemissiveTextured(ƒ.Color.CSS("White"), new ƒ.TextureImage("Assets/Textures/torus_grey.png"), 1, 0));
        constructor(_position, _index) {
            super("AdditionalTime");
            console.log("AddTime " + _index);
            Script.addTimeArray[_index].activate(true);
            this.appendChild(Script.addTimeArray[_index]);
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position)));
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
    var ƒUI = FudgeUserInterface;
    class GameInterface extends ƒ.Mutable {
        points = 0;
        lives = 0;
        time = 0;
        static visualUIdiv;
        static lastLifeAmount = 3;
        constructor(_initialLives) {
            super();
            GameInterface.visualUIdiv = document.querySelector("div#visualUI");
            GameInterface.visualUIdiv.style.display = "block";
            let visualUIController = new ƒUI.Controller(this, GameInterface.visualUIdiv);
            console.log(visualUIController);
            // this.time = _time;
            this.lives = _initialLives;
            for (let index = 0; index < _initialLives; index++) {
                this.addLifeImg();
            }
        }
        reduceMutator(_mutator) { }
        updateUserInterface() {
            // points
            let pointsSpan = GameInterface.visualUIdiv.querySelector("#points");
            pointsSpan.innerHTML = "" + this.points + "";
            // lives
            if (this.lives != GameInterface.lastLifeAmount) {
                console.log("life added");
                this.addLifeImg();
            }
            // time
            let timeSpan = GameInterface.visualUIdiv.querySelector("#time");
            if (this.time > 0) {
                timeSpan.innerHTML = this.displayTime(this.time);
            }
            else {
                timeSpan.innerHTML = "00:00";
            }
        }
        addLifeImg() {
            let randomNumber = 0;
            while (randomNumber == 0) {
                randomNumber = Math.round(Math.random() * 6);
            }
            let newLifeImg = document.createElement("img");
            newLifeImg.src = "Assets/life" + randomNumber + ".png";
            console.log(newLifeImg.src);
            let livesSpan = GameInterface.visualUIdiv.querySelector("#lives");
            livesSpan.appendChild(newLifeImg);
            GameInterface.lastLifeAmount = this.lives;
        }
        displayTime(_time) {
            let seconds = Math.floor(_time) % 60;
            // console.log("s " + seconds);
            let minutes = Math.floor(_time / 60) % 60;
            // console.log("m " + minutes);
            return this.pad(minutes) + ":" + this.pad(seconds); // format display time
        }
        pad(number) {
            // adds a zero if the number is less than 10
            return (number < 10 ? "0" : "") + number;
        }
        showEndscreen(_finalPoints, _finalTime) {
            let endScreenDiv = document.querySelector("div#endScreen");
            endScreenDiv.style.display = "block";
            let finalPointsSpan = endScreenDiv.querySelector("#finalPoints");
            finalPointsSpan.innerHTML = "" + _finalPoints;
            let finalTimeSpan = endScreenDiv.querySelector("#finalTime");
            if (this.time > 0) {
                finalTimeSpan.innerHTML = this.displayTime(_finalTime);
            }
            else {
                finalTimeSpan.innerHTML = "00:00";
            }
        }
    }
    Script.GameInterface = GameInterface;
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
    // import ƒAid = FudgeAid;
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
    let addTime1;
    let addTime2;
    let addTime3;
    let addTime4;
    let addTime5;
    let addTime6;
    let addTime7;
    let addTime8;
    let addTime9;
    let addTime10;
    let addTime11;
    let addTime12;
    Script.addTimeArray = [];
    let externalConfig;
    // export let gameState: GameState;
    let objectAte = 0;
    let gameInterface;
    let starPling;
    let itemAte;
    let won = false;
    let gameTime;
    let timer;
    //@ts-ignore
    document.addEventListener("interactiveViewportStarted", start);
    async function start(_event) {
        viewport = _event.detail;
        graph = viewport.getBranch();
        console.log(graph);
        await getExternalData();
        maze = graph.getChildrenByName("Maze")[0];
        Script.items = maze.getChildrenByName("Items")[0];
        getItemNodes();
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
        gameTime = new ƒ.Time();
        timer = new ƒ.Timer(gameTime, 1000, 0, updateTimer);
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics
        setUpCharacter();
        gameInterface = new Script.GameInterface(Script.initialLivesAmount);
    }
    function update(_event) {
        characterMovement();
        gameInterface.updateUserInterface();
        ƒ.Physics.simulate(); // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    async function getExternalData() {
        let response = await fetch("External.json");
        externalConfig = await response.json();
        Script.initialLivesAmount = externalConfig["initialLivesAmount"];
        console.log(Script.initialLivesAmount);
        // gameState = new GameState(gameDuration);
    }
    function getItemNodes() {
        life1 = Script.items.getChildrenByName("Life1")[0];
        life2 = Script.items.getChildrenByName("Life2")[0];
        Script.lifeArray[1] = life1;
        Script.lifeArray[2] = life2;
        console.log(Script.lifeArray);
        powerUp1 = Script.items.getChildrenByName("PowerUp1")[0];
        powerUp2 = Script.items.getChildrenByName("PowerUp2")[0];
        powerUp3 = Script.items.getChildrenByName("PowerUp3")[0];
        powerUp4 = Script.items.getChildrenByName("PowerUp4")[0];
        Script.powerUpArray[1] = powerUp1;
        Script.powerUpArray[2] = powerUp2;
        Script.powerUpArray[3] = powerUp3;
        Script.powerUpArray[4] = powerUp4;
        console.log(Script.powerUpArray);
        addTime1 = Script.items.getChildrenByName("AddTime1")[0];
        addTime2 = Script.items.getChildrenByName("AddTime2")[0];
        addTime3 = Script.items.getChildrenByName("AddTime3")[0];
        addTime4 = Script.items.getChildrenByName("AddTime4")[0];
        addTime5 = Script.items.getChildrenByName("AddTime5")[0];
        addTime6 = Script.items.getChildrenByName("AddTime6")[0];
        addTime7 = Script.items.getChildrenByName("AddTime7")[0];
        addTime8 = Script.items.getChildrenByName("AddTime8")[0];
        addTime9 = Script.items.getChildrenByName("AddTime9")[0];
        addTime10 = Script.items.getChildrenByName("AddTime10")[0];
        addTime11 = Script.items.getChildrenByName("AddTime11")[0];
        addTime12 = Script.items.getChildrenByName("AddTime12")[0];
        Script.addTimeArray[1] = addTime1;
        Script.addTimeArray[2] = addTime2;
        Script.addTimeArray[3] = addTime3;
        Script.addTimeArray[4] = addTime4;
        Script.addTimeArray[5] = addTime5;
        Script.addTimeArray[6] = addTime6;
        Script.addTimeArray[7] = addTime7;
        Script.addTimeArray[8] = addTime8;
        Script.addTimeArray[9] = addTime9;
        Script.addTimeArray[10] = addTime10;
        Script.addTimeArray[11] = addTime11;
        Script.addTimeArray[12] = addTime12;
        console.log(Script.addTimeArray);
    }
    function setUpCharacter() {
        cmpRigidbody = character.getComponent(ƒ.ComponentRigidbody);
        cmpRigidbody.mass = 8000;
        cmpRigidbody.friction = 10;
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
        if (objectAte == 10) { //170
            let finalPoints = gameInterface.points;
            let finalTime = gameInterface.time;
            console.log("final: " + finalPoints + " and " + finalTime);
            gameInterface.showEndscreen(finalPoints, finalTime);
            won = true;
            timer.active = false;
        }
        character.mtxLocal.rotation = new ƒ.Vector3(0, 0, 0);
        character.mtxWorld.rotation = new ƒ.Vector3(0, 0, 0);
        cmpRigidbody.dampRotation = 0;
        console.log("Local " + character.mtxLocal.rotation);
        console.log("World " + character.mtxWorld.rotation);
        //check the object and adds points, lives, sounds
        switch (collidedWithObject.name) {
            case "Star":
                gameInterface.points += 20;
                starPling.play(true);
                break;
            case "AdditionalTime":
                gameInterface.points += 5;
                gameInterface.time -= 5;
                itemAte.play(true);
                break;
            case "PowerUp":
                console.error("PowerUp Added!");
                gameInterface.points += 10;
                itemAte.play(true);
                break;
            case "Life":
                console.error("Life Added!");
                gameInterface.lives += 1;
                itemAte.play(true);
                break;
        }
    }
    function characterMovement() {
        const moveSpeed = 8;
        let velocity = ƒ.Vector3.ZERO();
        while (won != true) {
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
        }
        velocity.y = 0;
        //check if character stays still
        if (velocity.x == 0 && velocity.z == 0) {
            // console.log("x: " + velocity.x + ", z: " + velocity.z);
        }
        else {
            // console.log("x: " + velocity.x + ", z: " + velocity.z);
            cmpRigidbody.setVelocity(velocity);
        }
        cmpRigidbody.setRotation(ƒ.Vector3.ZERO());
    }
    function updateTimer() {
        gameInterface.time += 1;
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
    Script.indexLife = 1;
    Script.indexPowerUp = 1;
    Script.indexAddTime = 1;
    Script.indexStar = 1;
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
                        if (randomNumber <= 0.008 && Script.indexLife <= 2) { // 0,8%
                            itemType = ItemType.Life;
                        }
                        else if (randomNumber <= 0.017 && Script.indexPowerUp <= 4) { // 1,7%
                            itemType = ItemType.PowerUp;
                        }
                        else if (randomNumber <= 0.049 && Script.indexAddTime <= 12) { // 4,8%
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
            const star = new Script.Star(new Vector3(x, 0.5, z), Script.indexStar);
            Script.indexStar++;
            Script.items.addChild(star);
        }
        addAdditionalTime(x, z) {
            const additionalTime = new Script.AdditionalTime(new Vector3(x, 0, z), Script.indexAddTime);
            Script.indexAddTime++;
            Script.items.addChild(additionalTime);
        }
        addPowerUp(x, z) {
            const powerUp = new Script.PowerUp(new Vector3(x, 0, z), Script.indexPowerUp);
            Script.indexPowerUp++;
            Script.items.addChild(powerUp);
        }
        addLifes(x, z) {
            const life = new Script.Life(new Vector3(x, 0, z), Script.indexLife);
            Script.indexLife++;
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
        static spike;
        static meshSpike = new ƒ.MeshPyramid("Spike");
        static mtrSpike = new ƒ.Material("StarShader", ƒ.ShaderLitTextured, new ƒ.CoatRemissiveTextured(ƒ.Color.CSS("White"), new ƒ.TextureImage("Assets/Textures/torus_grey1.png"), 1, 0));
        static spikeAmount = 6;
        static degree = [0, 0, 60, 120, 180, 240, 300];
        constructor(_position, _index) {
            super("Star");
            for (let index = 1; index <= Star.spikeAmount; index++) {
                Star.spike = new ƒ.Node("Spike" + index);
                let meshComponent = new ƒ.ComponentMesh(new ƒ.MeshPyramid("Spike" + index));
                meshComponent.mtxPivot.translation.y = 0.8;
                meshComponent.mtxPivot.rotation.z = Star.degree[index];
                meshComponent.mtxPivot.scaling = new ƒ.Vector3(0.12, 0.28, 0.16);
                Star.spike.addComponent(meshComponent);
                Star.spike.addComponent(new ƒ.ComponentMaterial(Star.mtrSpike));
                Star.spike.getComponent(ƒ.ComponentMaterial).clrPrimary = ƒ.Color.CSS("#FFE45C");
                this.addChild(Star.spike);
            }
            // console.log("Star " + _index);
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position)));
            this.getComponent(ƒ.ComponentTransform).mtxLocal.rotateX(-12);
            this.getComponent(ƒ.ComponentTransform).mtxLocal.scale(new ƒ.Vector3(0.8, 0.8, 0.8));
            let cmpRigidbody = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.SPHERE);
            cmpRigidbody.isTrigger = true;
            this.addComponent(cmpRigidbody);
        }
    }
    Script.Star = Star;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map