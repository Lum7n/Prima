namespace Script {
    import ƒ = FudgeCore;

    export class Star extends ƒ.Node {
        static spike: ƒ.Node;
        static meshSpike: ƒ.MeshPyramid = new ƒ.MeshPyramid("Spike");
        static mtrSpike: ƒ.Material = new ƒ.Material("StarShader", ƒ.ShaderLitTextured, new ƒ.CoatRemissiveTextured(ƒ.Color.CSS("White"), new ƒ.TextureImage("Assets/Textures/torus_grey1.png"), 1, 0));
        static spikeAmount: number = 6;
        static degree: number[] = [0, 0, 60, 120, 180, 240, 300];

        constructor(_position: ƒ.Vector3, _index: number) {
            super("Star");

            for (let index = 1; index <= Star.spikeAmount; index++) {

                Star.spike = new ƒ.Node("Spike" + index);

                let meshComponent: ƒ.ComponentMesh = new ƒ.ComponentMesh(new ƒ.MeshPyramid("Spike" + index));
                meshComponent.mtxPivot.translation.y = 0.8;
                meshComponent.mtxPivot.rotation.z = Star.degree[index];
                meshComponent.mtxPivot.scaling = new ƒ.Vector3(0.12, 0.28, 0.16);

                Star.spike.addComponent(meshComponent);
                Star.spike.addComponent(new ƒ.ComponentMaterial(Star.mtrSpike));
                Star.spike.getComponent(ƒ.ComponentMaterial).clrPrimary = ƒ.Color.CSS("#FFE45C");

                this.addChild(Star.spike);
            }

            console.log("Star " + _index);

            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position)));
            this.getComponent(ƒ.ComponentTransform).mtxLocal.rotateX(-12);
            this.getComponent(ƒ.ComponentTransform).mtxLocal.scale(new ƒ.Vector3(0.8, 0.8, 0.8))

            let cmpRigidbody: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.SPHERE);
            cmpRigidbody.isTrigger = true;
            this.addComponent(cmpRigidbody)
        }
    }
}