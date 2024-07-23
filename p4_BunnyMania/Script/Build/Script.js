"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class AdditionalTime extends ƒ.Node {
        static addTime;
        static addTimeName = "AddTime";
        constructor(_position, _index) {
            super("AdditionalTime");
            AdditionalTime.addTimeName = AdditionalTime.addTimeName + _index;
            console.log(AdditionalTime.addTimeName);
            AdditionalTime.addTime = Script.items.getChildrenByName(AdditionalTime.addTimeName)[0];
            AdditionalTime.addTime.activate(true);
            this.appendChild(AdditionalTime.addTime);
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position)));
            let cmpRigidbody = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.SPHERE);
            cmpRigidbody.isTrigger = true;
            this.addComponent(cmpRigidbody);
            AdditionalTime.addTimeName = "AddTime";
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
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class DeterminePositions extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(DeterminePositions);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "DeterminePositions added to ";
        index;
        totalAmount;
        constructor(_index, _totalAmount) {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            this.index = _index;
            this.totalAmount = _totalAmount;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.calculatePosition);
        }
        // Activate the functions of this component as response to events
        calculatePosition() {
            //calculate the positions based on how many collectables exist, so they get spread out evenly in the game
            let max = ((80 / this.totalAmount) * this.index);
            let min = (80 / this.totalAmount) * (this.index - 1) + 10;
            let position = min + Math.floor(Math.random() * (max - min));
            //console.log(position);
            this.node.mtxLocal.translateX(position);
        } //calculatePosition
    }
    Script.DeterminePositions = DeterminePositions;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class Fox extends ƒ.Node {
        static fox;
        static foxName = "Fox";
        static positionArray = [new ƒ.Vector3(0, 0, 0), new ƒ.Vector3(0, 0, 0), new ƒ.Vector3(15, 0, 0), new ƒ.Vector3(6, 0, 7), new ƒ.Vector3(8, 0, 13), new ƒ.Vector3(2, 0, 2)];
        constructor(_index) {
            super("Fox");
            Fox.foxName = Fox.foxName + _index;
            console.log(Fox.foxName);
            Fox.fox = Script.foes.getChildrenByName(Fox.foxName)[0];
            Fox.fox.activate(true);
            this.appendChild(Fox.fox);
            console.log(Fox.positionArray[_index]);
            console.log(Fox.fox);
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(Fox.positionArray[_index])));
            let cmpRigidbody = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.KINEMATIC, ƒ.COLLIDER_TYPE.SPHERE);
            cmpRigidbody.isTrigger = true;
            cmpRigidbody.addEventListener("ColliderEnteredCollision" /* ƒ.EVENT_PHYSICS.COLLISION_ENTER */, (_event) => {
                console.log("test");
            });
            this.addComponent(cmpRigidbody);
            this.getChild(0).getComponent(ƒ.ComponentAnimator).activate(true);
            Fox.foxName = "Fox";
        }
    }
    Script.Fox = Fox;
})(Script || (Script = {}));
// this.rigidbody.addEventListener(ƒ.EVENT_PHYSICS.COLLISION_ENTER, (_event: ƒ.EventPhysics) => {
//     if (_event.cmpRigidbody.node.name == "Pingu") {
//         this.stateMachine.transit(JOB.FLY);
//         setTimeout(() => {
//             this.stateMachine.transit(JOB.SHINE);
//         },         2000);
//     }
// });
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
                if (this.lives - GameInterface.lastLifeAmount > 0) {
                    console.log("life added");
                    this.addLifeImg();
                    GameInterface.lastLifeAmount = this.lives;
                }
                else if (this.lives - GameInterface.lastLifeAmount < 0) {
                    console.log("life killed");
                    this.killLifeImg();
                    GameInterface.lastLifeAmount = this.lives;
                    if (this.lives == 0) {
                        Script.timer.active = false;
                        this.showEndscreen(this.points, this.time);
                        Script.won = true;
                    }
                }
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
        }
        killLifeImg() {
            let livesSpan = GameInterface.visualUIdiv.querySelector("#lives");
            let livesSpanChildren = livesSpan.getElementsByTagName("img");
            let livesSpanChild = livesSpanChildren[0];
            console.log(livesSpanChildren);
            livesSpan.removeChild(livesSpanChild);
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
            if (Script.won != true) {
                let titelH1 = endScreenDiv.querySelector("h1");
                titelH1.innerHTML = "Game Over";
                let titelH2 = endScreenDiv.querySelector("h2");
                titelH2.innerHTML = "You lost!";
            }
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
        static life;
        static lifeName = "Life";
        constructor(_position, _index) {
            super("Life");
            Life.lifeName = Life.lifeName + _index;
            console.log(Life.lifeName);
            Life.life = Script.items.getChildrenByName(Life.lifeName)[0];
            Life.life.activate(true);
            this.appendChild(Life.life);
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position)));
            let cmpRigidbody = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.SPHERE);
            cmpRigidbody.isTrigger = true;
            this.addComponent(cmpRigidbody);
            Life.lifeName = "Life";
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
    let cmpRigidbody;
    let modeMachine;
    let sound;
    Script.initialLivesAmount = 3;
    Script.modeIndex = 4;
    let starAte = 0;
    let gameInterface;
    let starPling;
    let itemAte;
    Script.won = false;
    let timeout = false;
    let gameTime;
    //@ts-ignore
    document.addEventListener("interactiveViewportStarted", start);
    async function start(_event) {
        viewport = _event.detail;
        graph = viewport.getBranch();
        console.log(graph);
        await getExternalData();
        maze = graph.getChildrenByName("Maze")[0];
        Script.items = maze.getChildrenByName("Items")[0];
        Script.foes = maze.getChildrenByName("Foes")[0];
        const myMaze = new Script.Maze(16, 16);
        // Add stars and power-ups to the maze where there are no cubes
        myMaze.addItems();
        for (let index = 0; index < 5; index++) {
            myMaze.addFoes();
        }
        Script.character = graph.getChildrenByName("Character")[0];
        console.log(Script.character);
        let cameraNode = Script.character.getChildrenByName("Camera")[0];
        console.log(cameraNode);
        let camera = cameraNode.getComponent(ƒ.ComponentCamera);
        console.log(camera);
        viewport.camera = camera;
        sound = graph.getChildrenByName("Audio")[0];
        starPling = sound.getChildrenByName("Star")[0].getComponent(ƒ.ComponentAudio);
        itemAte = sound.getChildrenByName("otherItem")[0].getComponent(ƒ.ComponentAudio);
        gameTime = new ƒ.Time();
        Script.timer = new ƒ.Timer(gameTime, 1000, 0, updateTimer);
        setUpCharacter();
        gameInterface = new Script.GameInterface(Script.initialLivesAmount);
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics
    }
    function update(_event) {
        gameInterface.updateUserInterface();
        characterMovement();
        ƒ.Physics.simulate(); // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    async function getExternalData() {
        let response = await fetch("External.json");
        Script.externalConfig = await response.json();
        Script.row0 = Script.externalConfig["z0"];
        Script.row1 = Script.externalConfig["z1"];
        Script.row2 = Script.externalConfig["z2"];
        Script.row3 = Script.externalConfig["z3"];
        Script.row4 = Script.externalConfig["z4"];
        Script.row5 = Script.externalConfig["z5"];
        Script.row6 = Script.externalConfig["z6"];
        Script.row7 = Script.externalConfig["z7"];
        Script.row8 = Script.externalConfig["z8"];
        Script.row9 = Script.externalConfig["z9"];
        Script.row10 = Script.externalConfig["z10"];
        Script.row11 = Script.externalConfig["z11"];
        Script.row12 = Script.externalConfig["z12"];
        Script.row13 = Script.externalConfig["z13"];
        Script.row14 = Script.externalConfig["z14"];
        Script.row15 = Script.externalConfig["z15"];
    }
    function setUpCharacter() {
        cmpRigidbody = Script.character.getComponent(ƒ.ComponentRigidbody);
        cmpRigidbody.mass = 8000;
        cmpRigidbody.friction = 10;
        cmpRigidbody.dampTranslation = 5;
        cmpRigidbody.dampRotation = 1000;
        cmpRigidbody.effectRotation.x = 0;
        cmpRigidbody.effectRotation.y = 0;
        cmpRigidbody.effectRotation.z = 0;
        cmpRigidbody.addEventListener("TriggerEnteredCollision" /* ƒ.EVENT_PHYSICS.TRIGGER_ENTER */, collision);
        modeMachine = new Script.ModeSwitch();
        Script.character.addComponent(modeMachine);
        modeMachine.stateCurrent = Script.JOB.NORMAL;
        console.log(modeMachine.stateCurrent);
    }
    function collision(_event) {
        console.log(_event.cmpRigidbody.node);
        let collidedWithObject = _event.cmpRigidbody.node;
        // try to fix the rotation
        Script.character.mtxLocal.rotation = new ƒ.Vector3(0, 0, 0);
        Script.character.mtxWorld.rotation = new ƒ.Vector3(0, 0, 0);
        cmpRigidbody.effectRotation.y = 0;
        cmpRigidbody.dampRotation = 1000;
        console.log("Local " + Script.character.mtxLocal.rotation);
        console.log("World " + Script.character.mtxWorld.rotation);
        //check the object and adds points, lives, sounds
        console.log(collidedWithObject.name);
        switch (collidedWithObject.name) {
            case "Star":
                starAte++;
                gameInterface.points += 20;
                starPling.play(true);
                break;
            case "AdditionalTime":
                gameInterface.points += 5;
                gameInterface.time -= 5;
                itemAte.play(true);
                break;
            case "PowerUp":
                gameInterface.points += 10;
                itemAte.play(true);
                modeMachine.transit(Script.JOB.POWER);
                if (timeout == false) {
                    setTimeout(afterPowerMode, 5000);
                }
                else if (timeout == true) {
                    setTimeout(afterPowerMode, 5000);
                }
                timeout = true;
                break;
            case "Life":
                gameInterface.lives += 1;
                itemAte.play(true);
                break;
            case "Fox":
                break;
            case "Key":
                Script.won = true;
                Script.timer.active = false;
                let finalPoints = gameInterface.points;
                let finalTime = gameInterface.time;
                console.log("final: " + finalPoints + " and " + finalTime);
                gameInterface.showEndscreen(finalPoints, finalTime);
                break;
        }
        // won?
        if (starAte == Script.indexStar) { //175
            showKey();
        }
        // if the Fox is killable
        if (collidedWithObject.name == "Fox") {
            if (modeMachine.stateCurrent == 0) { // NORMAL MODE
                console.log("Victim");
                gameInterface.lives -= 1;
            }
            else if (modeMachine.stateCurrent == 1) { // POWER MODE
                console.log("Fox-Killer");
                let objectParent = collidedWithObject.getParent();
                objectParent.removeChild(collidedWithObject);
            }
        }
        else {
            let objectParent = collidedWithObject.getParent();
            objectParent.removeChild(collidedWithObject);
        }
    }
    function afterPowerMode() {
        modeMachine.transit(Script.JOB.NORMAL);
        timeout = false;
    }
    function showKey() {
        let key = Script.items.getChildrenByName("Key")[0];
        key.activate(true);
        key.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(9, 0, 8))));
        let cmpRigidbody = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.SPHERE);
        cmpRigidbody.isTrigger = true;
        key.addComponent(cmpRigidbody);
        Script.items.appendChild(key);
    }
    function characterMovement() {
        const moveSpeed = 10;
        let velocity = ƒ.Vector3.ZERO();
        if (Script.won != true) {
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
        ItemType[ItemType["AdditionalTime"] = 1] = "AdditionalTime";
        ItemType[ItemType["PowerUp"] = 2] = "PowerUp";
        ItemType[ItemType["Life"] = 3] = "Life";
        ItemType[ItemType["Empty"] = 4] = "Empty";
    })(ItemType || (ItemType = {}));
    let TileType;
    (function (TileType) {
        TileType[TileType["Bush"] = 0] = "Bush";
        TileType[TileType["Empty"] = 1] = "Empty";
    })(TileType = Script.TileType || (Script.TileType = {}));
    let itemTypeArray = [];
    itemTypeArray[0] = 0;
    let itemNumber = 0;
    let previousItem = 0;
    let lastItem = ItemType.Empty;
    Script.indexStar = 0;
    Script.indexAddTime = 0;
    Script.indexPowerUp = 0;
    Script.indexLife = 0;
    Script.indexFox = 0;
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
            grid.push(Script.row0);
            grid.push(Script.row1);
            grid.push(Script.row2);
            grid.push(Script.row3);
            grid.push(Script.row4);
            grid.push(Script.row5);
            grid.push(Script.row6);
            grid.push(Script.row7);
            grid.push(Script.row8);
            grid.push(Script.row9);
            grid.push(Script.row10);
            grid.push(Script.row11);
            grid.push(Script.row12);
            grid.push(Script.row13);
            grid.push(Script.row14);
            grid.push(Script.row15);
            console.log(grid);
            return grid;
        }
        addItems() {
            for (let z = 0; z < this.height; z++) {
                for (let x = 0; x < this.width; x++) {
                    if (this.grid[z][x] === TileType.Empty) {
                        let randomNumber = Math.random();
                        let itemType;
                        if (randomNumber <= 0.012 && Script.indexLife < 2) { // 1,2%
                            itemType = ItemType.Life;
                        }
                        else if (randomNumber <= 0.023 && Script.indexPowerUp < 4) { // 2,3%
                            itemType = ItemType.PowerUp;
                        }
                        else if (randomNumber <= 0.071 && Script.indexAddTime < 12) { // 7,1%
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
            Script.indexStar++;
            const star = new Script.Star(new Vector3(x, 0.5, z), Script.indexStar);
            Script.items.addChild(star);
        }
        addAdditionalTime(x, z) {
            Script.indexAddTime++;
            const additionalTime = new Script.AdditionalTime(new Vector3(x, 0, z), Script.indexAddTime);
            Script.items.addChild(additionalTime);
        }
        addPowerUp(x, z) {
            Script.indexPowerUp++;
            const powerUp = new Script.PowerUp(new Vector3(x, 0, z), Script.indexPowerUp);
            Script.items.addChild(powerUp);
        }
        addLifes(x, z) {
            Script.indexLife++;
            const life = new Script.Life(new Vector3(x, 0, z), Script.indexLife);
            Script.items.addChild(life);
        }
        addFoes() {
            Script.indexFox++;
            const fox = new Script.Fox(Script.indexFox);
            Script.foes.addChild(fox);
        }
    }
    Script.Maze = Maze;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    let JOB;
    (function (JOB) {
        JOB[JOB["NORMAL"] = 0] = "NORMAL";
        JOB[JOB["POWER"] = 1] = "POWER";
    })(JOB = Script.JOB || (Script.JOB = {}));
    class ModeSwitch extends ƒAid.ComponentStateMachine {
        static iSubclass = ƒ.Component.registerSubclass(ModeSwitch);
        static instructions = ModeSwitch.get();
        constructor() {
            super();
            this.instructions = ModeSwitch.instructions; // setup instructions with the static set
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.handleEvent);
            this.addEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.handleEvent);
            // this.addEventListener(ƒ.EVENT.NODE_DESERIALIZED, this.handleEvent);
        }
        static get() {
            let setup = new ƒAid.StateMachineInstructions();
            setup.transitDefault = ModeSwitch.transitDefault;
            setup.actDefault = ModeSwitch.actDefault;
            setup.setAction(JOB.NORMAL, this.actNormal);
            setup.setAction(JOB.POWER, this.actPower);
            return setup;
        }
        static transitDefault(_machine) {
            let stateNextName;
            switch (_machine.stateNext) {
                case 0:
                    stateNextName = "NORMAL MODE";
                    break;
                case 1:
                    stateNextName = "POWER MODE";
                    Script.modeIndex--;
                    break;
                default:
                    break;
            }
            console.log("Transit to " + stateNextName);
        }
        static async actDefault(_machine) {
            console.log(JOB[_machine.stateCurrent]);
        }
        static actNormal(_machine) {
            let childrenOfCharacter = Script.character.getChildrenByName("PowerMode");
            let childPowerMode = childrenOfCharacter[0];
            Script.character.removeChild(childPowerMode);
        }
        static actPower(_machine) {
            let modeItems = Script.items.getChildrenByName("PowerMode")[Script.modeIndex];
            modeItems.activate(true);
            Script.character.addChild(modeItems);
        }
        handleEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* ƒ.EVENT.COMPONENT_ADD */:
                    ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, this.update);
                    break;
                case "componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */:
                    ƒ.Loop.removeEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, this.update); //sam
                    this.removeEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.handleEvent);
                    this.removeEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.handleEvent);
                    break;
            }
        };
        update = (_event) => {
            this.act();
        };
    }
    Script.ModeSwitch = ModeSwitch;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class PowerUp extends ƒ.Node {
        static powerUp;
        static powerUpName = "PowerUp";
        constructor(_position, _index) {
            super("PowerUp");
            PowerUp.powerUpName = PowerUp.powerUpName + _index;
            console.log(PowerUp.powerUpName);
            PowerUp.powerUp = Script.items.getChildrenByName(PowerUp.powerUpName)[0];
            PowerUp.powerUp.activate(true);
            this.appendChild(PowerUp.powerUp);
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position)));
            let cmpRigidbody = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.SPHERE);
            cmpRigidbody.isTrigger = true;
            this.addComponent(cmpRigidbody);
            PowerUp.powerUpName = "PowerUp";
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
        static mtrSpike = new ƒ.Material("StarShader", ƒ.ShaderLitTextured, new ƒ.CoatRemissiveTextured(ƒ.Color.CSS("#FFE45C"), new ƒ.TextureImage("Assets/Textures/torus_grey1.png"), 1, 0));
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