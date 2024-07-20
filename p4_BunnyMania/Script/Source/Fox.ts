namespace Script {
    import ƒ = FudgeCore;

    export class Fox extends ƒ.Node {
        static fox: ƒ.Node;
        static foxName: string = "Fox";

        constructor(_index: number) {
            super("Fox");

            Fox.foxName = Fox.foxName + _index;
            console.log(Fox.foxName);
            Fox.fox = foes.getChildrenByName(Fox.foxName)[0];

            Fox.fox.activate(true);


            Fox.fox.addComponent(new ƒ.ComponentTransform());

            let cmpRigidbody: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.SPHERE);
            cmpRigidbody.isTrigger = true;
            cmpRigidbody.addEventListener(ƒ.EVENT_PHYSICS.COLLISION_ENTER, (_event: ƒ.EventPhysics) => {
                console.log("test");
            }); 

            Fox.fox.addComponent(cmpRigidbody);
            this.appendChild(Fox.fox);


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