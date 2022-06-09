import { finalize, Observable, of, Subject } from "rxjs";
import { GlobalState, StoryState } from "../state/action-state";

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

  abstract id: number;

  /**
   * This method performs the action
   * @param state 
   * @returns the `ResultUpdate` when not async, otherwise intermittent results are returned using
   * `update.publish()` and the final result is returned using `update.complete()`
   */
  protected abstract updateState(update: ActionStart): ActionResult | void;

  private speedup$?: Subject<void>;

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
    const actionState = new ActionStart(storyState, globalState, results$, this.speedup$)
    let result = this.updateState(actionState);
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

  speedup() {
    this.speedup$?.next();
  }
}

/**
 * making action state updates easy async with the
 * `publish`, `complete` and `speedup` utility methods
 */
export class ActionStart implements ActionResult {
  // optional feedback from front-end components to active action (e.g. to notify that the frontend animation has completed)
  feedback$?: Observable<any>;
  nextActionId?: number;

  constructor(
    public story: StoryState,
    public global: GlobalState,
    private results$: Subject<ActionResult>,
    private speedup$: Observable<void>
  ) { }

  publish() {
    this.results$.next(this);
  }

  complete() {
    this.results$.next(this);
    this.results$.complete();
  }

  speedup(finishAction: () => ActionResult | void) {
    const subscription = this.speedup$.subscribe(() => {
      const result = finishAction();
      if (result) {
        this.results$.next(result);
      } else {
        this.results$.next(this);
      }
      this.results$.complete();
      subscription.unsubscribe();
    });
  }
}