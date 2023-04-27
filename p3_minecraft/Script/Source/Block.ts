namespace Script {
    import ƒ = FudgeCore;

    export class Block extends ƒ.Node {
        static meshCube: ƒ.MeshCube = new ƒ.MeshCube("Block");
        static mtrCube: ƒ.Material = new ƒ.Material("Block", ƒ.ShaderFlat, new ƒ.CoatRemissive());

        constructor(_position: ƒ.Vector3, _color: ƒ.Color) {
            super("Block");
            this.addComponent(new ƒ.ComponentMesh(Block.meshCube));

            let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(Block.mtrCube);
            cmpMaterial.clrPrimary = _color;
            this.addComponent(cmpMaterial);

            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position)))
            
            // this.addComponent(new ƒ.ComponentTransform())
            
            // this.cmpTransform(new ƒ.ComponentPick = new ƒ.ComponentPick()


        }
    }


}