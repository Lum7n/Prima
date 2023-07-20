namespace Script {
    import ƒ = FudgeCore;
    export class Lives extends ƒ.Node {
        static meshSphere: ƒ.MeshSphere = new ƒ.MeshSphere("Lives");
        static mtrSphere: ƒ.Material = new ƒ.Material("Lives", ƒ.ShaderFlat, new ƒ.CoatRemissive());

        constructor(_position: ƒ.Vector3) {
            super("Lives");
            this.addComponent(new ƒ.ComponentMesh(Star.meshSphere));

            let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(Star.mtrSphere);
            cmpMaterial.clrPrimary = ƒ.Color.CSS("LawnGreen");
            this.addComponent(cmpMaterial);

            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position)));
        }
    }
}