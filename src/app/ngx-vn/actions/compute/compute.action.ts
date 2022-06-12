import { ActionSource, ActionResult, StoryAction } from '@ngx-vn/actions/abstract-story-action';
import { story } from '@ngx-vn/story/story';

type ModifyFunction = (update: ActionSource) => ActionResult | void;

// TODO: assign the correct Actor type to the actor (string for initial testing)
export interface ModifyActionParameters {
  modifyFunction: ModifyFunction;
  noAutoPublish?: boolean;
}

/**
 * Execute a custom state modification
 * @param modifyFunction - function that can modify parts of the ActionStart structure it receives
 */
export function modify(modifyFunction: ModifyFunction, noAutoPublish?: boolean): number {
  return story.appendAction(new ModifyAction({ modifyFunction, noAutoPublish }));
}

class ModifyAction extends StoryAction {
  override get autoContinue(): boolean {
    return true;
  }

  constructor(private params: ModifyActionParameters) {
    super();
  }

  protected override updateState(update: ActionSource): void {
    this.params.modifyFunction(update);
    if (!this.params.noAutoPublish) {
      update.publish();
      update.complete();
    }
  }
}
