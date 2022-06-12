import { ActionSource, StoryAction } from '@ngx-vn/actions/abstract-story-action';
import { story } from '@ngx-vn/story/story';


export type BackgroundAnimationType = 'fadeIn' | 'fadeOut' | 'fromLeft' | 'fromRight' | 'fromTop' | 'fromBottom';

export interface BackgroundActionParams {
  color: string;
  image: string;
  duration: number;
  animation: BackgroundAnimationType;
  keepText: boolean;
}

/**
 * Only display the defined background
 */
export function background(background: Partial<BackgroundActionParams>): ActionSource | void {
  story.appendAction(new BackgroundAction(background));
}

class BackgroundAction extends StoryAction {
  override get autoContinue(): boolean {
    return true;
  }

  constructor(
    private params: Partial<BackgroundActionParams>
  ) {
    super();
  }

  protected override updateState(update: ActionSource): void {
    update.story.action = {
      background: { ...this.params }
    };
    if (!this.params.animation) { // no animation, just return the result
      update.publish();
      update.complete();
    } else { // contains animation, wait for completion/speedup
      // function that defines the state after the animation has completed/speedup is invoked
      const completeAnimation = () => {
        delete update.story.action.background?.animation;
        update.complete();
      };

      // complete after front-end component calls update.feedback$.complete()
      update.feedback$.subscribe({ complete: completeAnimation });

      // define reaction to speedup request from the ActionCenter
      update.onSpeedup = completeAnimation;

      // start animation
      update.publish();
    }
  }
}
