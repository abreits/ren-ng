import { finalize, from, Observable, Subject } from 'rxjs';

import { GlobalState, StoryState } from '@ngx-vn/states/states';

export interface ActionResult<Stats = unknown> {
  nextActionId?: number;
  story: StoryState<Stats>;
  global: GlobalState;
}

/**
 * The action base class, all other action classes are based on this class.
 * This is the minimal implementation for a base class
 */
export abstract class StoryAction<Stats = unknown> {
  /**
   * This method updates the story state as defined in the ActionSource.
   * 
   * - Intermittent results are published by calling `update.publish()`, 
   *   frontend components can receive these updates by subscribing to the actionCenterService.state$,
   * - End of publication is signalled by calling `update.complete()`
   */
  protected abstract updateState(update: ActionSource<Stats>): void;

  id!: number; // will always have a value when added to the ActionCenter?
  private interrupt$?: Subject<boolean>;

  /**
   * Whether the next action should automatically start after this action has completed.
   * Defaults to `false`.
   * Override in subclass to `true` when this is the case
   * 
   * e.g. text display, selections and minigames should not autocontinue, background changes should.
   */
  get autoContinue() {
    return false;
  }

  /**
   * `true`, the execute function always returns the same new states for input states.
   * Override in subclass to `false` when this is not the case
   * 
   * e.g. selections and minigames are usually not pure, text displays and background animations are pure. 
   */
  get pure() {
    return true;
  }

  /** 
   * The execute observable can publish multiple resultupdates
   */
  execute(storyState: StoryState<Stats>, globalState: GlobalState): Observable<ActionResult> {
    const results$ = new Subject<ActionResult>();
    this.interrupt$ = new Subject();

    const actionStart = new ActionSource<Stats>(storyState, globalState, results$, this.interrupt$);

    // setup handling of speedup and abort interrupts
    this.interrupt$.subscribe((abort: boolean) => {
      if (abort) {
        // no need to receive result any more, result will be overwritten by redo or undo action
        results$.complete();
        this.interrupt$?.complete();
        if (actionStart.onAbort) {
          actionStart.onAbort();
        }
      } else {
        if (actionStart.onSpeedup) {
          actionStart.onSpeedup();
        }
      }
    });
    this.updateState(actionStart);
    // pass result$ through and close speedup$ when it completes
    return results$.pipe(finalize(() => this.interrupt$?.complete()));
  }

  /**
   * Request to speed up the execution of this action.
   * 
   * e.g. to skip the rest of an animation
   */
  speedup() {
    this.interrupt$?.next(false);
  }

  /**
   * Order to abort the execution of this action
   * 
   * e.g. when an undo or redo action is performed during execution of this action
   */
  abort() {
    this.interrupt$?.next(false);
  }

  /**
   * Create a seen id for this start storyState. If the action should not be marked as seen, return undefined
   */
  seenId(storyState: StoryState): Observable<string | undefined> {
    const key = {
      id: this.id,
      state: storyState.action
    };
    return from(this.hash(key));
  }

  protected async hash(src: unknown) {
    const buffer = new TextEncoder().encode(JSON.stringify(src));
    const arrayBuffer = await crypto.subtle.digest('SHA-256', buffer);
    return btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
  }
}

/**
 * making action state updates easy async with the
 * `publish`, `complete` and `speedup` utility methods
 */
export class ActionSource<Stats = unknown> implements ActionResult<Stats> {
  // optional feedback from front-end components to active action (e.g. to notify that the frontend animation has completed)
  readonly feedback$ = new Subject<unknown>();
  nextActionId?: number;

  constructor(
    public story: StoryState<Stats>,
    public global: GlobalState,
    private results$: Subject<ActionResult>,
    private interrupt$: Subject<boolean>
  ) { }

  /**
   * Publish the current update state as intermittent result (action continues)
   */
  publish() {
    this.results$.next(this);
  }

  /**
   * Publish the current update state as final result (end of action)
   */
  complete() {
    this.results$.complete();
    this.interrupt$.complete();
  }

  /**
   * Function to be called when a speedup of the current action is requested.
   *
   * e.g. skip to end of animation
   */
  onSpeedup?: () => void;

  /**
   * Cleanup function to be called when the current action is aborted.
   *
   * e.g. cleanup of observables created for the action
   */
  onAbort?: () => void;
}
