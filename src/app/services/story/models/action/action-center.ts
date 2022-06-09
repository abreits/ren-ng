import { createDraft, finishDraft } from "immer"
import { Subject, Subscription } from "rxjs";

import { GlobalState, HistoryState, StoryState } from "../state/action-state";
import { ActionResult, StoryAction } from "./abstract-story-action";

class ActionCenter {
  private actionHistory: HistoryState[] = []

  private actions = new Map<number, StoryAction>();
  private nextId = 0;

  // TODO: make sure these entries contain values
  private storyState!: Readonly<StoryState>;
  private globalState!: GlobalState;

  addAction(action: StoryAction): void {
    action.id = this.nextId++;
    this.actions.set(action.id, action);
  }

  // walking through the action states
  private stateSubject$ = new Subject<ActionResult>();
  public state$ = this.stateSubject$.asObservable();

  private nextActionId = -1;

  private actionSubscription?: Subscription;
  private currentAction?: StoryAction;
  private currentActionHistory?: HistoryState;

  /**
   * Start the next action,
   *   if an action is busy
   *     if an action is skippable
   *       
   */
  nextAction() {
    if (!this.actionSubscription || this.actionSubscription.closed) {
      this.executeAction(this.nextActionId++);
    } else {
      this.currentAction?.speedup();
    }
  }

  executeAction(id: number) {
    const action = this.actions.get(id);
    this.currentAction = action;
    if (action) {
      const draftState = createDraft(this.storyState);
      this.actionSubscription = action.execute(draftState, this.globalState).subscribe({
        next: actionResult => {
          // the state resulted in a different nextActionId, store it (e.g. selection result)
          if (actionResult.nextActionId) {
            this.nextActionId = actionResult.nextActionId;
          }
          this.stateSubject$.next(actionResult);
        },
        complete: () => {
          this.storyState = finishDraft(draftState, (patches, inversePatches) => {
            if (action.autoContinue) {
              // directly continue with next action, do not store this state
              this.nextAction();
            } else {
              // if currently completed actionHistory exists: move to history and replace with current
              if (this.currentActionHistory) {
                this.actionHistory.push(this.currentActionHistory);
              }
              this.currentActionHistory = {
                nextActionId: this.nextActionId,
                previousToCurrentStatePatches: patches,
                currentToPreviousStatePatches: inversePatches
              }
            }
          });
        }
      });
    } else {
      // TODO: action does not exist, goto end of story
    }
  }

  previousHistoryAction() {

  }

  nextHistoryAction() {
    
  }

}

export const actionCenter = new ActionCenter();