import { from } from 'rxjs';
import { delay } from 'rxjs/operators';

import { ActionSource, ActionResult, StoryAction } from '@ngx-vn/actions/abstract-story-action/abstract-story-action';
import { story } from '@ngx-vn/story/story';

// TODO: assign the correct Actor type to the actor (string for initial testing)
export interface TextActionParams {
  text: string;
  actor?: string;
}

/**
 * Only display the defined background
 */
export function text(text: string, actor?: string): number {
  return story.appendAction(new TextAction({ text, actor }));
}

class TextAction extends StoryAction {
  override get autoContinue(): boolean {
    return true;
  }

  constructor(private params: TextActionParams) {
    super();
  }

  override updateState(update: ActionSource): ActionResult | void {
    const textAction = { ... this.params };
    update.story.action.text = textAction;

    if (update.global.letterInterval <= 0) {
      // no animation, just return the result
      return update;
    }

    update.onSpeedup = () => {
      // stop sending updates and update to the full text
      subscription.unsubscribe();
      textAction.text = this.params.text;
      update.publish();
      update.complete();
    };

    update.onAbort = () => {
      // only need to cleanup the subscription
      subscription.unsubscribe();
    };

    // display one letter at a time
    textAction.text = '';
    update.publish();
    const subscription = from(this.params.text).pipe(delay(update.global.letterInterval)).subscribe({
      next: nextLetter => {
        textAction.text += nextLetter;
        update.publish();
      },
      complete: () => {
        update.complete();
      }
    });
  }
}
