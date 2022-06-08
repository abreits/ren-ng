import { concatMap, defaultIfEmpty, delay, first, Observable, of, Subject } from "rxjs";
import { StoryAction } from "./abstract-story-action";

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
      // action.updateState(this.currentState);
      // this.state$.next(this.currentState);
      // // close after the first element and wait for next tick before proceeding (otherwise execution order can mess up)
      // action.waitForCompletion(this.currentState).pipe(first(), delay(0)).subscribe(nextId => {
      //   this.nextActionId = nextId;
      // });
    }
  }
}

export const actionCenter = new ActionCenter();
