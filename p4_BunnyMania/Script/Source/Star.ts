namespace Script {
    import ƒ = FudgeCore;
    export class Star extends ƒ.Node {
        static meshSphere: ƒ.MeshSphere = new ƒ.MeshSphere("Star");
        static mtrSphere: ƒ.Material = new ƒ.Material("Star", ƒ.ShaderFlat, new ƒ.CoatRemissive());

        constructor(_position: ƒ.Vector3, _scale: number) {
            super("Star");
            this.addComponent(new ƒ.ComponentMesh(Star.meshSphere));

            let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(Star.mtrSphere);
            cmpMaterial.clrPrimary = ƒ.Color.CSS("Gold");
            this.addComponent(cmpMaterial);

            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position)));

            this.getComponent(ƒ.ComponentTransform).mtxLocal.scale(ƒ.Vector3.ONE(_scale));
        }
    }
}