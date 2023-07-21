namespace Script {
    import ƒ = FudgeCore;

    export class AdditionalTime extends ƒ.Node {
        static meshSphere: ƒ.MeshSphere = new ƒ.MeshSphere("AdditionalTime");
        static mtrSphere: ƒ.Material = new ƒ.Material("AdditionalTime", ƒ.ShaderFlat, new ƒ.CoatRemissive());

        constructor(_position: ƒ.Vector3, _scale: number) {
            super("AdditionalTime");
            this.addComponent(new ƒ.ComponentMesh(AdditionalTime.meshSphere));

            let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(AdditionalTime.mtrSphere);
            cmpMaterial.clrPrimary = ƒ.Color.CSS("DarkSlateBlue");
            this.addComponent(cmpMaterial);

            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position)));
            this.getComponent(ƒ.ComponentTransform).mtxLocal.scale(ƒ.Vector3.ONE(_scale));

            let cmpRigidbody: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.SPHERE);
            cmpRigidbody.isTrigger = true;
            this.addComponent(cmpRigidbody)
        }
    }
}