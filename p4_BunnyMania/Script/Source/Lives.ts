namespace Script {
    import ƒ = FudgeCore;
    export class Lives extends ƒ.Node {
        static meshSphere: ƒ.MeshSphere = new ƒ.MeshSphere("Lives");
        static mtrSphere: ƒ.Material = new ƒ.Material("Lives", ƒ.ShaderFlat, new ƒ.CoatRemissive());

        constructor(_position: ƒ.Vector3, _scale: number) {
            super("Lives");
            this.addComponent(new ƒ.ComponentMesh(Lives.meshSphere));

            let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(Lives.mtrSphere);
            cmpMaterial.clrPrimary = ƒ.Color.CSS("LawnGreen");
            this.addComponent(cmpMaterial);

            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position)));

            this.getComponent(ƒ.ComponentTransform).mtxLocal.scale(ƒ.Vector3.ONE(_scale));

            let cmpRigidbody: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.SPHERE);
            cmpRigidbody.isTrigger = true; 
            this.addComponent(cmpRigidbody)
        }
    }
}