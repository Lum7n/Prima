declare namespace Script {
    import ƒ = FudgeCore;
    class Block extends ƒ.Node {
        static meshCube: ƒ.MeshCube;
        static mtrCube: ƒ.Material;
        constructor(_position: ƒ.Vector3, _color: ƒ.Color);
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
    let viewport: ƒ.Viewport;
    let blocks: ƒ.Node;
    let grid: Block[][][];
}
declare function createBody(): void;
declare function generateWorld(_width: number, _height: number, _depth: number): void;
declare function characterMovement(): void;
declare namespace Script {
    function pickByComponent(_event: PointerEvent): void;
    function hitComponent(_event: PointerEvent): void;
    function pickByCamera(_event: PointerEvent): void;
    function pickByDistance(_event: PointerEvent): void;
    function pickByGrid(_event: PointerEvent): void;
}
