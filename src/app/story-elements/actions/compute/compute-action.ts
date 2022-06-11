import { from } from 'rxjs';
import { delay } from 'rxjs/operators';

import { story } from '../../story/story';
import { ActionStart, ActionResult, StoryAction } from '../abstract-story-action/abstract-story-action';

type ModifyFunction = (update: ActionStart) => ActionResult | void;

// TODO: assign the correct Actor type to the actor (string for initial testing)
export interface ModifyActionParameters {
  modifyFunction: ModifyFunction;
}

/**
 * Execute a custom state modification
 */
export function ModifyActionParameters(modifyFunction: ModifyFunction): number {
  return story.appendAction(new ModifyAction({ modifyFunction }));
}

class ModifyAction extends StoryAction {
  override get autoContinue(): boolean {
    return true;
  }

  constructor(private params: ModifyActionParameters) {
    super();
  }

  override updateState(update: ActionStart): ActionResult | void {
    this.params.modifyFunction(update);
    return update; 
  }
}
