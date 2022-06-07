import { concat, concatMap, concatMapTo, defaultIfEmpty, Observable, of, Subject } from "rxjs";
import { actionCenter, ActionState, StoryAction } from "./action-definitions";

export function background(background: Partial<BackgroundActionParams>) {
  actionCenter.addAction(new BackgroundAction(background));
}

export type BackgroundAnimationType = 'fadeIn' | 'fadeOut' | 'fromLeft' | 'fromRight' | 'fromTop' | 'fromBottom';

interface BackgroundActionParams {
  color: string;
  image: string;
  duration: number;
  animation: BackgroundAnimationType;
  keepText: boolean;
}


class BackgroundAction extends StoryAction {
  get skippable() { return true; }

  constructor(
    private params: Partial<BackgroundActionParams>
  ) {
    super();
  }

  updateState(state: ActionState): void {
    if (!this.params.keepText) {
      state.anim.hideText = true;
    }

    const storyParams = { ...this.params };
    delete storyParams.duration;
    delete storyParams.animation;
    state.story.background = storyParams;

    // initialize background animation
    if (this.params.animation) {
      const complete$ = new Subject();
      state.anim = {
        background: { 
          animation: this.params.animation,
          duration: this.params.duration
        },
        complete$: complete$
      };
    }
  }
}
