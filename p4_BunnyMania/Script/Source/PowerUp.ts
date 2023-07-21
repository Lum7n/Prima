namespace Script {
    import ƒ = FudgeCore;
    export class PowerUp extends ƒ.Node {
        static meshSphere: ƒ.MeshSphere = new ƒ.MeshSphere("PowerUp");
        static mtrSphere: ƒ.Material = new ƒ.Material("PowerUp", ƒ.ShaderFlat, new ƒ.CoatRemissive());

        constructor(_position: ƒ.Vector3, _scale: number) {
            super("PowerUp");
            this.addComponent(new ƒ.ComponentMesh(PowerUp.meshSphere));

            let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(PowerUp.mtrSphere);
            cmpMaterial.clrPrimary = ƒ.Color.CSS("CornflowerBlue");
            this.addComponent(cmpMaterial);

            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position)));

            this.getComponent(ƒ.ComponentTransform).mtxLocal.scale(ƒ.Vector3.ONE(_scale));

            let cmpRigidbody: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.SPHERE);
            cmpRigidbody.isTrigger = true; 
            this.addComponent(cmpRigidbody)
        }
    }
}