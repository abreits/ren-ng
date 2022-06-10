import { from } from 'rxjs';
import { delay } from 'rxjs/operators';

import { story } from '../../story/story';
import { ActionStart, ActionResult, StoryAction } from '../abstract-story-action/abstract-story-action';

// TODO: assign the correct Actor type to the actor (string for initial testing)
export interface TextActionParameters {
  text: string;
  actor?: string;
}

/**
 * Only display the defined background
 */
export function text(text: string, actor?: string): ActionStart | void {
  story.appendAction(new TextAction({ text, actor }));
}

class TextAction extends StoryAction {
  override get autoContinue(): boolean {
    return true;
  }

  constructor(private params: TextActionParameters) {
    super();
  }

  override updateState(update: ActionStart): ActionResult | void {
    update.story.action.text = { ... this.params };

    if (update.global.textSpeed <= 0) {
      // no animation, just return the result
      return update;
    }

    // update to the full text after speedup
    update.speedup(() => {
      subscription.unsubscribe();
      update.story.action.text!.text = this.params.text;
      update.complete();
    });

    // display one letter at a time
    const subscription = from(this.params.text).pipe(delay(update.global.textSpeed)).subscribe(nextLetter => {
      update.story.action.text!.text += nextLetter;
    })
  }
}
