import { ActionUpdate, ResultUpdate, StoryAction } from "./abstract-story-action";

/**
 * Modify the story state
 * @param modify - function that changes the state
 * 
 * @example processState(state => state.nextAction++) // just skip to the next action
 */
export function updateState(update: (state: ActionUpdate) => void): ActionUpdate | void {
  // actionCenter.addAction(new UpdateStateAction(update));  
  new UpdateStateAction(update)
}

updateState(update => {

})

class UpdateStateAction extends StoryAction {
  constructor(
    private update: (update: ActionUpdate) => ResultUpdate | void
  ) {
    super();
  }

  override id = -1;

  override updateState(update: ActionUpdate): ResultUpdate | void {
      return this.update(update);
  }
}