namespace Script {
    import ƒ = FudgeCore;

    export class Life extends ƒ.Node {

        constructor(_position: ƒ.Vector3, _index: number) {
            super("Life");

            console.log("Life " + _index);
            lifeArray[_index].activate(true);
            
            this.appendChild(lifeArray[_index]);

            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position)));

            let cmpRigidbody: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.SPHERE);
            cmpRigidbody.isTrigger = true; 
            this.addComponent(cmpRigidbody)
        }
    }
}