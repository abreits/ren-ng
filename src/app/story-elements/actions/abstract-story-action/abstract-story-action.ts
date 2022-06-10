import { finalize, from, Observable, of, Subject } from 'rxjs';
import { GlobalState, StoryState } from '../../states/states';

export interface ActionResult {
  nextActionId?: number;
  story: StoryState;
  global: GlobalState;
}

/**
 * The action base class, all other action classes are based on this class.
 * This is the minimal implementation for a base class
 */
export abstract class StoryAction {
  id!: number; // will always have a value when added to the ActionCenter

  /**
   * This method performs the action
   * @param state 
   * @returns the `ResultUpdate` when not async, otherwise intermittent results are returned using
   * `update.publish()` and the final result is returned using `update.complete()`
   */
  protected abstract updateState(update: ActionStart): ActionResult | void;

  private speedup$?: Subject<boolean>;

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
  execute(storyState: StoryState, globalState: GlobalState): Observable<ActionResult> {
    const results$ = new Subject<ActionResult>();
    this.speedup$ = new Subject();
    const actionStart = new ActionStart(storyState, globalState, results$, this.speedup$)
    let result = this.updateState(actionStart);
    if (result) {
      // should be a synchronous, close the Subjects and send the result
      results$.complete();
      this.speedup$.complete;
      return of(result);
    } else {
      // pass result$ through and close speedup$ when it completes
      return results$.pipe(finalize(() => this.speedup$?.complete()));
    }
  }

  speedup(kill: boolean) {
    this.speedup$?.next(kill);
  }

  /**
   * create a seen id for this start storyState. If the action should not be marked as seen, return undefined
   */
  seenId(storyState: StoryState): Observable<string | undefined> {
    const key = {
      id: this.id,
      state: storyState.action
    }
    return from(this.hash(key));
  }

  protected async hash(src: any) {
    const buffer = new TextEncoder().encode(JSON.stringify(src));
    const arrayBuffer = await crypto.subtle.digest('SHA-256', buffer);
    return btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
  }
}

/**
 * making action state updates easy async with the
 * `publish`, `complete` and `speedup` utility methods
 */
export class ActionStart implements ActionResult {
  // optional feedback from front-end components to active action (e.g. to notify that the frontend animation has completed)
  feedback$ = new Subject<any>();
  nextActionId?: number;

  constructor(
    public story: StoryState,
    public global: GlobalState,
    private results$: Subject<ActionResult>,
    private speedup$: Observable<boolean>
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
    this.results$.next(this);
    this.results$.complete();
  }

  /**
   * Specify reaction to the speedup request, only needed for async actions (e.g. to skip a long animation)
   * - if `kill` is false, just try to finish the current action as fast as possible,
   *   it can be ignored, but for the best user experience please don't.
   * - if `kill` is true, cleanup all internal stuff (e.g. running subscriptions) and close the current action, 
   *   no need to publish() or complete() a valid update because the result will be ignored,
   *   handling of this is mandatory!
   */
  speedup(finishAction: (kill: boolean) => void) {
    const subscription = this.speedup$.subscribe((kill: boolean) => {
      if(kill) {
        // no need to receive result any more, result will be overwritten by redo or undo action
        this.results$.complete();
      }
      finishAction(kill);
      // TODO: only unsubscribe here when kill is true, otherwise unsubscribe/close when action complete
      // problem: can only perform one cleanup, not kill after no kill
      subscription.unsubscribe();
    });
  }
}