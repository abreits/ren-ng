import { finalize, Observable, of, Subject } from "rxjs";
import { PublishState } from "../state/action-state";

export interface ResultUpdate {
  actionId?: number;
  state: PublishState;
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
  protected abstract updateState(update: ActionUpdate): ResultUpdate | void;

  private speedup$?: Subject<void>;

  /** 
   * The execute observable can publish multiple resultupdates
   */
  execute(currentState: PublishState): Observable<ResultUpdate> {
    const results$ = new Subject<ResultUpdate>();
    this.speedup$ = new Subject();
    const actionState = new ActionUpdate(currentState, results$, this.speedup$)
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
 export class ActionUpdate implements ResultUpdate {
  constructor(
    public state: PublishState,
    private results$: Subject<ResultUpdate>,
    private speedup$: Observable<void>
  ) { }

  publish() {
    this.results$.next(this);
  }

  complete() {
    this.results$.next(this);
    this.results$.complete();
  }

  speedup(finishAction: () => ResultUpdate | void) {
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