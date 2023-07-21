declare namespace Script {
    import ƒ = FudgeCore;
    class AdditionalTime extends ƒ.Node {
        static meshSphere: ƒ.MeshSphere;
        static mtrSphere: ƒ.Material;
        constructor(_position: ƒ.Vector3, _scale: number);
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
    class Lives extends ƒ.Node {
        static meshSphere: ƒ.MeshSphere;
        static mtrSphere: ƒ.Material;
        constructor(_position: ƒ.Vector3, _scale: number);
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    let rabbit: ƒ.Node;
    class Maze {
        private readonly width;
        private readonly height;
        private readonly grid;
        constructor(_width: number, _height: number);
        private createEmptyGrid;
        addStarsAndPowerUps1(): void;
        protected addStar(x: number, z: number): void;
        protected addPowerUp(x: number, z: number): void;
        protected addLives(x: number, z: number): void;
        protected addAdditionalTime(x: number, z: number): void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class PowerUp extends ƒ.Node {
        static meshSphere: ƒ.MeshSphere;
        static mtrSphere: ƒ.Material;
        constructor(_position: ƒ.Vector3, _scale: number);
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class Star extends ƒ.Node {
        static meshSphere: ƒ.MeshSphere;
        static mtrSphere: ƒ.Material;
        constructor(_position: ƒ.Vector3, _scale: number);
    }
}
