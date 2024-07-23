namespace Script {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;

  export enum JOB {
    NORMAL,       //0
    POWER,        //1
  }

  export class ModeSwitch extends ƒAid.ComponentStateMachine<JOB> {
    public static readonly iSubclass: number = ƒ.Component.registerSubclass(ModeSwitch);
    private static instructions: ƒAid.StateMachineInstructions<JOB> = ModeSwitch.get();

    public constructor() {
      super();
      this.instructions = ModeSwitch.instructions; // setup instructions with the static set

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
      setup.transitDefault = ModeSwitch.transitDefault;
      setup.actDefault = ModeSwitch.actDefault;
      setup.setAction(JOB.NORMAL, <ƒ.General>this.actNormal);
      setup.setAction(JOB.POWER, <ƒ.General>this.actPower);
      return setup;
    }

    private static transitDefault(_machine: ModeSwitch): void {
      let stateNextName: string;
      switch (_machine.stateNext) {
        case 0:
          stateNextName = "NORMAL MODE";
          break;
        case 1:
          stateNextName = "POWER MODE";
          modeIndex--;
          break;
        default:
          break;
      }
      console.log("Transit to " + stateNextName);
    }

    private static async actDefault(_machine: ModeSwitch): Promise<void> {
      console.log(JOB[_machine.stateCurrent]);
    }

    private static actNormal(_machine: ModeSwitch): void {
      let childrenOfCharacter: ƒ.Node[] = character.getChildrenByName("PowerMode")
      let childPowerMode: ƒ.Node = childrenOfCharacter[0]
      character.removeChild(childPowerMode);
    }

    private static actPower(_machine: ModeSwitch): void {
      let modeItems: ƒ.Node = items.getChildrenByName("PowerMode")[modeIndex];
      modeItems.activate(true);
      character.addChild(modeItems);
    }

    public handleEvent = (_event: Event): void => {
      switch (_event.type) {
        case ƒ.EVENT.COMPONENT_ADD:
          ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
          break;
        case ƒ.EVENT.COMPONENT_REMOVE:
          ƒ.Loop.removeEventListener(ƒ.EVENT.LOOP_FRAME, this.update); //sam
          this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.handleEvent);
          this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.handleEvent);
          break;
      }
    }

    public update = (_event: Event): void => {
      this.act();
    }
  }
}