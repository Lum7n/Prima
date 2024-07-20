declare namespace Script {
    import ƒ = FudgeCore;
    class AdditionalTime extends ƒ.Node {
        static addTime: ƒ.Node;
        static addTimeName: string;
        constructor(_position: ƒ.Vector3, _index: number);
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class DeterminePositions extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        index: number;
        totalAmount: number;
        constructor(_index: number, _totalAmount: number);
        calculatePosition(): void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class Fox extends ƒ.Node {
        static fox: ƒ.Node;
        static foxName: string;
        constructor(_index: number);
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class GameInterface extends ƒ.Mutable {
        points: number;
        lives: number;
        time: number;
        static visualUIdiv: HTMLDivElement;
        static lastLifeAmount: number;
        constructor(_initialLives: number);
        protected reduceMutator(_mutator: ƒ.Mutator): void;
        updateUserInterface(): void;
        addLifeImg(): void;
        displayTime(_time: number): string;
        pad(number: number): string;
        showEndscreen(_finalPoints: number, _finalTime: number): void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class Life extends ƒ.Node {
        static life: ƒ.Node;
        static lifeName: string;
        constructor(_position: ƒ.Vector3, _index: number);
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    let items: ƒ.Node;
    let foes: ƒ.Node;
    interface ExternalData {
        [name: string]: TileType[];
    }
    let externalConfig: ExternalData;
    let row0: TileType[];
    let row1: TileType[];
    let row2: TileType[];
    let row3: TileType[];
    let row4: TileType[];
    let row5: TileType[];
    let row6: TileType[];
    let row7: TileType[];
    let row8: TileType[];
    let row9: TileType[];
    let row10: TileType[];
    let row11: TileType[];
    let row12: TileType[];
    let row13: TileType[];
    let row14: TileType[];
    let row15: TileType[];
    let initialLivesAmount: number;
    let won: boolean;
}
declare namespace Script {
    enum TileType {
        Bush = 0,
        Empty = 1
    }
    let indexLife: number;
    let indexPowerUp: number;
    let indexAddTime: number;
    let indexStar: number;
    let indexFox: number;
    class Maze {
        private readonly width;
        private readonly height;
        private readonly grid;
        constructor(_width: number, _height: number);
        private createEmptyGrid;
        addItems(): void;
        protected addStar(x: number, z: number): void;
        protected addAdditionalTime(x: number, z: number): void;
        protected addPowerUp(x: number, z: number): void;
        protected addLifes(x: number, z: number): void;
        addFoes(): void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class PowerUp extends ƒ.Node {
        static powerUp: ƒ.Node;
        static powerUpName: string;
        constructor(_position: ƒ.Vector3, _index: number);
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class Star extends ƒ.Node {
        static spike: ƒ.Node;
        static meshSpike: ƒ.MeshPyramid;
        static mtrSpike: ƒ.Material;
        static spikeAmount: number;
        static degree: number[];
        constructor(_position: ƒ.Vector3, _index: number);
    }
}
declare namespace Script {
    import ƒAid = FudgeAid;
    enum JOB {
        NORMAL = 0,
        POWER = 1,
        VULNERABLE = 2,
        STAR = 3,
        KEY = 4
    }
    class StarMachine extends ƒAid.ComponentStateMachine<JOB> {
        private static instructions;
        constructor();
        static get(): ƒAid.StateMachineInstructions<JOB>;
        private static transitDefault;
        private static actDefault;
        private static actNormal;
        private static actPower;
        private static actVulnerable;
        private static actStar;
        private static actKey;
        handleEvent: (_event: Event) => void;
        update: (_event: Event) => void;
    }
}
