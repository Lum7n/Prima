namespace Script {
    import ƒ = FudgeCore;
    export class Lifes extends ƒ.Node {
        // static meshCube: ƒ.MeshCube = new ƒ.MeshCube("Lifes");
        // static mtrCube: ƒ.Material = new ƒ.Material("Lifes", ƒ.ShaderFlat, new ƒ.CoatRemissive());

        constructor(_position: ƒ.Vector3, _scale: number) {
            super("Lifes");


            this.appendChild(life)

            // this.addComponent(new ƒ.ComponentMesh(Lifes.meshCube));

            // let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(Lifes.mtrCube);
            // cmpMaterial.clrPrimary = ƒ.Color.CSS("LawnGreen");
            // this.addComponent(cmpMaterial);
            console.log(_position);

            // let cmpTransform: ƒ.ComponentTransform = 
            // cmpTransform.transform.
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position)));

            // this.getComponent(ƒ.ComponentTransform).mtxLocal.scale(ƒ.Vector3.ONE(_scale));

            let cmpRigidbody: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.SPHERE);
            cmpRigidbody.isTrigger = true; 
            this.addComponent(cmpRigidbody)
        }
    }
}