declare namespace Script {
    import ƒ = FudgeCore;
    class AdditionalTime extends ƒ.Node {
        static meshPyramid: ƒ.MeshPyramid;
        static mtrPyramid: ƒ.Material;
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
    class Lifes extends ƒ.Node {
        constructor(_position: ƒ.Vector3, _scale: number);
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    let items: ƒ.Node;
    let life: ƒ.Node;
    let life2: ƒ.Node;
    let lifeCopy: ƒ.Node;
}
declare namespace Script {
    class Maze {
        private readonly width;
        private readonly height;
        private readonly grid;
        constructor(_width: number, _height: number);
        private createEmptyGrid;
        addItems(): void;
        protected addStar(x: number, z: number): void;
        protected addPowerUp(x: number, z: number): void;
        protected addLifes(x: number, z: number): void;
        protected addAdditionalTime(x: number, z: number): void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class PowerUp extends ƒ.Node {
        static meshTorus: ƒ.MeshTorus;
        static mtrTorus: ƒ.Material;
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
declare namespace Script {
}
