namespace Script {
    import ƒ = FudgeCore;

    export class Block extends ƒ.Node {
        constructor() {
            super("Block");
            let meshCube: ƒ.MeshCube = new ƒ.MeshCube("Block");
            let mtrCube: ƒ.Material = new ƒ.Material("Block", ƒ.ShaderFlat, new ƒ.CoatRemissive());
            this.addComponent(new ƒ.ComponentTransform);
            this.addComponent(new ƒ.ComponentMesh(meshCube));
            this.addComponent(new ƒ.ComponentMaterial(mtrCube));


        }
    }


}