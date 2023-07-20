namespace Script {
    import ƒ = FudgeCore;
    export class AdditionalTime extends ƒ.Node {
        static meshSphere: ƒ.MeshSphere = new ƒ.MeshSphere("AdditionalTime");
        static mtrSphere: ƒ.Material = new ƒ.Material("AdditionalTime", ƒ.ShaderFlat, new ƒ.CoatRemissive());

        constructor(_position: ƒ.Vector3) {
            super("AdditionalTime");
            this.addComponent(new ƒ.ComponentMesh(Star.meshSphere));

            let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(Star.mtrSphere);
            cmpMaterial.clrPrimary = ƒ.Color.CSS("DarkSlateBlue");
            this.addComponent(cmpMaterial);

            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position)));
        }
    }
}