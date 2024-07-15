namespace Script {
    import ƒ = FudgeCore;

    export class AdditionalTime extends ƒ.Node {
        static meshPyramid: ƒ.MeshPyramid = new ƒ.MeshPyramid("AdditionalTime");
        static mtrPyramid: ƒ.Material = new ƒ.Material("AdditionalTime", ƒ.ShaderFlatTextured, new ƒ.CoatRemissiveTextured(ƒ.Color.CSS("White"), new ƒ.TextureImage("Assets/Textures/torus_grey.png"), 1, 0));

        constructor(_position: ƒ.Vector3, _index: number) {
            super("AdditionalTime");

            console.log("AddTime " + _index);
            addTimeArray[_index].activate(true);
            
            this.appendChild(addTimeArray[_index]);

            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position)));

            let cmpRigidbody: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.SPHERE);
            cmpRigidbody.isTrigger = true;
            this.addComponent(cmpRigidbody)
        }
    }
}