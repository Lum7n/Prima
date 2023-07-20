namespace Script {
    import ƒ = FudgeCore;
    export class PowerUp extends ƒ.Node {
        static meshSphere: ƒ.MeshSphere = new ƒ.MeshSphere("PowerUp");
        static mtrSphere: ƒ.Material = new ƒ.Material("PowerUp", ƒ.ShaderFlat, new ƒ.CoatRemissive());

        constructor(_position: ƒ.Vector3) {
            super("PowerUp");
            this.addComponent(new ƒ.ComponentMesh(Star.meshSphere));

            let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(Star.mtrSphere);
            cmpMaterial.clrPrimary = ƒ.Color.CSS("CornflowerBlue");
            this.addComponent(cmpMaterial);

            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position)));
        }
    }
}