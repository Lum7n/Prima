namespace Script {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;

  export enum JOB {
    NORMAL, POWER, VULNERABLE,
    STAR, KEY
  }

  export class StarMachine extends ƒAid.ComponentStateMachine<JOB> {
    private static instructions: ƒAid.StateMachineInstructions<JOB> = StarMachine.get();

    public constructor() {
      super();
      this.instructions = StarMachine.instructions; // setup instructions with the static set

      // Don't start when running in editor
      if (ƒ.Project.mode == ƒ.MODE.EDITOR)
        return;

      // Listen to this component being added to or removed from a node
      this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.handleEvent);
      this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.handleEvent);
      // this.addEventListener(ƒ.EVENT.NODE_DESERIALIZED, this.handleEvent);
    }


    public static get(): ƒAid.StateMachineInstructions<JOB> {
      let setup: ƒAid.StateMachineInstructions<JOB> = new ƒAid.StateMachineInstructions();
      setup.transitDefault = StarMachine.transitDefault;
      setup.actDefault = StarMachine.actDefault;
      setup.setAction(JOB.NORMAL, <ƒ.General>this.actNormal);
      setup.setAction(JOB.POWER, <ƒ.General>this.actPower);
      setup.setAction(JOB.VULNERABLE, <ƒ.General>this.actVulnerable);
      setup.setAction(JOB.STAR, <ƒ.General>this.actStar);
      setup.setAction(JOB.KEY, <ƒ.General>this.actKey);
      return setup;
    }

    private static transitDefault(_machine: StarMachine): void {
      console.log("Transit to", _machine.stateNext);
    }

    private static async actDefault(_machine: StarMachine): Promise<void> {
      console.log(JOB[_machine.stateCurrent]);
    }

    private static actNormal(_machine: StarMachine): void {
      //
    }

    private static actPower(_machine: StarMachine): void {
      let star: Star = <Star>_machine.node;
      star.removeComponent(star.rigidbody);
      star.animate();
      star.starAudio.play(true);
    } //actPower

    private static actVulnerable(_machine: StarMachine): void {
      let star: Star = <Star>_machine.node;
      star.removeComponent(star.stateMachine);
      stars.splice(stars.indexOf(star));
      collectables.removeChild(star);
      gameState.stars += 1;
      switch (gameState.stars) {
        case 1: {
          let starImage: HTMLImageElement = <HTMLImageElement>document.getElementById("star1");
          starImage.style.display = "block";
          break;
        }
        case 2: {
          let starImage: HTMLImageElement = <HTMLImageElement>document.getElementById("star2");
          starImage.style.display = "block";
          break;
        }
        case 3: {
          let starImage: HTMLImageElement = <HTMLImageElement>document.getElementById("star3");
          starImage.style.display = "block";
          break;
        }
        default:
          break;
      }
    } //actVulnerable

    public handleEvent = (_event: Event): void => {
      switch (_event.type) {
        case ƒ.EVENT.COMPONENT_ADD:
          ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
          // this.transit(JOB.IDLE);
          break;
        case ƒ.EVENT.COMPONENT_REMOVE:
          ƒ.Loop.removeEventListener(ƒ.EVENT.LOOP_FRAME, this.update); //sam
          this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.handleEvent);
          this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.handleEvent);
        // ƒ.Loop.removeEventListener(ƒ.EVENT.LOOP_FRAME, this.update); //Jirka
        // case ƒ.EVENT.NODE_DESERIALIZED: //jirka
        //   this.transit(JOB.IDLE);
          // let trigger: ƒ.ComponentRigidbody = this.node.getChildren()[0].getComponent(ƒ.ComponentRigidbody);
          // trigger.addEventListener(ƒ.EVENT_PHYSICS.TRIGGER_ENTER, (_event: ƒ.EventPhysics) => {
          //   console.log("TriggerEnter", _event.cmpRigidbody.node.name);
          //   if (_event.cmpRigidbody.node.name == "Cart" && this.stateCurrent != JOB.DIE)
          //     this.transit(JOB.ESCAPE);
          // });
          // trigger.addEventListener(ƒ.EVENT_PHYSICS.TRIGGER_EXIT, (_event: ƒ.EventPhysics) => {
          //   if (this.stateCurrent == JOB.ESCAPE)
          //     this.transit(JOB.IDLE);
          // });
          break;
      }
    }

    public update = (_event: Event): void => {
      this.act();
    }

  }
}