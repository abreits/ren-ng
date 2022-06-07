import { actionCenter, ActionState, StoryAction } from "./action-definitions";

export function updateState(updateFunction: (state: ActionState) => number | void) {
  actionCenter.addAction(new StateAction(updateFunction));
}



export class StateAction extends StoryAction {
  get skippable() { return false; }

  constructor(
    private updateFunction: (state: ActionState) => number | void
  ) {
    super();
  }

  updateState(state: ActionState) {
    this.updateFunction(state);
  }
}
