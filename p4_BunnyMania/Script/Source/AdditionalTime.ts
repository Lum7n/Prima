namespace Script {
    import ƒ = FudgeCore;

    export class AdditionalTime extends ƒ.Node {
        static addTime: ƒ.Node;
        static addTimeName: string = "AddTime";

        constructor(_position: ƒ.Vector3, _index: number) {
            super("AdditionalTime");

            AdditionalTime.addTimeName = AdditionalTime.addTimeName + _index;
            console.log(AdditionalTime.addTimeName);
            AdditionalTime.addTime = items.getChildrenByName(AdditionalTime.addTimeName)[0];

            AdditionalTime.addTime.activate(true);
            
            this.appendChild(AdditionalTime.addTime);

            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position)));

            let cmpRigidbody: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.SPHERE);
            cmpRigidbody.isTrigger = true;
            this.addComponent(cmpRigidbody)

            AdditionalTime.addTimeName = "AddTime";
        }
    }
}