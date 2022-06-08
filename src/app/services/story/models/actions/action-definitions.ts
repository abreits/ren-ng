import { concatMap, defaultIfEmpty, delay, first, Observable, of, Subject } from "rxjs";

// collection containing the storystate
export interface StoryState {
  global: any; // global settings
  story: any; // story specific state, such as text, speaker and background
  actors: any; // collection of all actors in the story, e.g. the people present
  stats: any; // other stats such as locations uncovered
}


export interface ActionState extends StoryState {
  anim?: any; // temporary feedback to the state e.g. when an animation is completed in a component
}


export abstract class StoryAction {
  public id: number = -1;

  protected running$: Observable<number> | undefined;

  // update the state
  abstract updateState(state: ActionState): Observable<ActionState>;

  // returns next story action to be executed
  waitForCompletion(state: ActionState): Observable<number> {
    if (state.anim.complete$) {
      // returns the next id after the complete$ Subject has been closed
      return state.anim.complete$.pipe(defaultIfEmpty(true), concatMap(() => of(this.id + 1)));
    } else {
      // return the next id now
      return of(this.id + 1);
    }
  }

  speedupCompletion(state: ActionState): void {
    state.anim?.complete$?.complete();
  }

  // some async actions, e.g. animations do not need to complete before continuing
  abstract get skippable(): boolean;
}


export class ActionCenter {
  private currentState = {
    global: {},
    story: {},
    actors: {},
    stats: {},
    anim: {}
  }
  private actions = new Map<number, StoryAction>();
  private nextId = 0;

  addAction(action: StoryAction): void {
    action.id = this.nextId++;
    this.actions.set(action.id, action);
  }

  // walking through the action states
  public state$ = new Subject<ActionState>();

  private currentActionId = -1;
  private nextActionId = -1;

  /**
   * Start the next action,
   *   if an action is busy
   *     if an action is skippable
   *       
   */
  nextAction() {

  }

  executeAction(id: number) {
    const action = this.actions.get(id);
    if (action) {
      action.updateState(this.currentState);
      this.state$.next(this.currentState);
      // close after the first element and wait for next tick before proceeding (otherwise execution order can mess up)
      action.waitForCompletion(this.currentState).pipe(first(), delay(0)).subscribe(nextId => {
        this.nextActionId = nextId;
      });
    }
  }
}

export const actionCenter = new ActionCenter();
