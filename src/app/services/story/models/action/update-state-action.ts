import { ActionStart, ActionResult, StoryAction } from "./abstract-story-action";

/**
 * Modify the story state
 * @param modify - function that changes the state
 * 
 * @example processState(state => state.nextAction++) // just skip to the next action
 */
export function updateState(updateFunction: (update: ActionStart) => void): ActionStart | void {
  // actionCenter.addAction(new UpdateStateAction(update));  
  new UpdateStateAction(updateFunction)
}

updateState(update => {
  return update;
})

class UpdateStateAction extends StoryAction {
  override get autoContinue(): boolean {
    return true;
  }

  constructor(
    private updateFunction: (update: ActionStart) => ActionResult | void
  ) {
    super();
  }

  override id = -1;

  override updateState(update: ActionStart): ActionResult | void {
      return this.updateFunction(update);
  }
}