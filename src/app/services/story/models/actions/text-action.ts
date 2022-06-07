import { of } from "rxjs";
import { actionCenter, ActionState, StoryAction } from "./action-definitions";

export function text(text: string, actor?: string) {
  actionCenter.addAction(new TextAction(text, actor));
}

export class TextAction extends StoryAction {
  get skippable() { return false; }

  constructor(
    private text: string,
    private actor?: string
  ) {
    super();
  }

  
  updateState(state: ActionState): void {
    state.story.text = this.text;
    state.story.actor = this.actor;

    // // to do when lettter for letter text drawing animation is implemented animation
    // // initialize text animation
    // if (this.params.animation) {
    //   const complete$ = new Subject();
    //   state.anim = {
    //     background: { 
    //       animation: this.params.animation,
    //       duration: this.params.duration
    //     },
    //     complete$: complete$
    //   };
    // }
  }
}
