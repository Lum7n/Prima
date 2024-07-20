namespace Script {
    import ƒ = FudgeCore;

    export class Life extends ƒ.Node {
        static life: ƒ.Node;
        static lifeName: string = "Life";

        constructor(_position: ƒ.Vector3, _index: number) {
            super("Life");

            Life.lifeName = Life.lifeName + _index;
            console.log(Life.lifeName);
            Life.life = items.getChildrenByName(Life.lifeName)[0];

            Life.life.activate(true);
            
            this.appendChild(Life.life);

            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position)));

            let cmpRigidbody: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.SPHERE);
            cmpRigidbody.isTrigger = true; 
            this.addComponent(cmpRigidbody)

            Life.lifeName = "Life";
        }
    }
}