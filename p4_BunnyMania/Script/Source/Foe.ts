namespace Script {
    import ƒ = FudgeCore;

    export class Foe extends ƒ.Node {
        static fox: ƒ.Node;
        static foxName: string = "Fox";

        constructor(_index: number) {
            super("Foe");

            Foe.foxName = Foe.foxName + _index;
            console.log(Foe.foxName);
            Foe.fox = foes.getChildrenByName(Foe.foxName)[0];

            Foe.fox.activate(true);

            this.appendChild(Foe.fox);

            this.addComponent(new ƒ.ComponentTransform());

            let cmpRigidbody: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.SPHERE);
            cmpRigidbody.isTrigger = true;
            this.addComponent(cmpRigidbody)

            Foe.foxName = "Fox";
        }
    }
}