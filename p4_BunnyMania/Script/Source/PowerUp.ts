namespace Script {
    import ƒ = FudgeCore;

    export class PowerUp extends ƒ.Node {

        constructor(_position: ƒ.Vector3, _index: number) {
            super("PowerUp");

            console.log("PowerUp " + _index);
            powerUpArray[_index].activate(true);
            
            this.appendChild(powerUpArray[_index]);

            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position)));

            let cmpRigidbody: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.SPHERE);
            cmpRigidbody.isTrigger = true; 
            this.addComponent(cmpRigidbody)
        }
    }
}