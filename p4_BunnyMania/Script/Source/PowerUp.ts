namespace Script {
    import ƒ = FudgeCore;

    export class PowerUp extends ƒ.Node {
        static powerUp: ƒ.Node;
        static powerUpName: string = "PowerUp";

        constructor(_position: ƒ.Vector3, _index: number) {
            super("PowerUp");

            PowerUp.powerUpName = PowerUp.powerUpName + _index;
            console.log(PowerUp.powerUpName);
            PowerUp.powerUp = items.getChildrenByName(PowerUp.powerUpName)[0];

            PowerUp.powerUp.activate(true);

            this.appendChild(PowerUp.powerUp);

            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position)));

            let cmpRigidbody: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.SPHERE);
            cmpRigidbody.isTrigger = true;
            this.addComponent(cmpRigidbody)

            PowerUp.powerUpName = "PowerUp";
        }
    }
}