namespace Script {
    import ƒ = FudgeCore;

    export class Fox extends ƒ.Node {
        static fox: ƒ.Node;
        static foxName: string = "Fox";
        static positionArray: ƒ.Vector3[] = [new ƒ.Vector3(0, 0, 0), new ƒ.Vector3(0, 0, 0), new ƒ.Vector3(15, 0, 0), new ƒ.Vector3(6, 0, 7), new ƒ.Vector3(8, 0, 13), new ƒ.Vector3(2, 0, 2)];

        constructor(_index: number) {
            super("Fox");

            Fox.foxName = Fox.foxName + _index;
            console.log(Fox.foxName);
            Fox.fox = foes.getChildrenByName(Fox.foxName)[0];

            Fox.fox.activate(true);
            this.appendChild(Fox.fox);

            console.log(Fox.positionArray[_index])
            console.log(Fox.fox);

            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(Fox.positionArray[_index])));

            let cmpRigidbody: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.KINEMATIC, ƒ.COLLIDER_TYPE.SPHERE);
            cmpRigidbody.isTrigger = true;
            cmpRigidbody.addEventListener(ƒ.EVENT_PHYSICS.COLLISION_ENTER, (_event: ƒ.EventPhysics) => {
                console.log("test");
            });

            this.addComponent(cmpRigidbody);

            this.getChild(0).getComponent(ƒ.ComponentAnimator).activate(true);

            Fox.foxName = "Fox";
        }
    }
}

// this.rigidbody.addEventListener(ƒ.EVENT_PHYSICS.COLLISION_ENTER, (_event: ƒ.EventPhysics) => {
//     if (_event.cmpRigidbody.node.name == "Pingu") {
//         this.stateMachine.transit(JOB.FLY);
//         setTimeout(() => {
//             this.stateMachine.transit(JOB.SHINE);
//         },         2000);
//     }
// });