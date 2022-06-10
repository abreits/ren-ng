import { Injectable } from '@angular/core';
import { applyPatches, createDraft, enablePatches, finishDraft } from "immer"
import { Subject, Subscription } from "rxjs";

import { GlobalState, UndoState, RedoState, StoryState } from "../../story-elements/states/states";
import { ActionResult, StoryAction } from "../../story-elements/actions/abstract-story-action/abstract-story-action";
import { story } from 'src/app/story-elements/story/story';

enablePatches();

@Injectable({
  providedIn: 'root'
})
export class ActionCenterService {
  // TODO: make sure these entries contain values and save/store them
  private nextActionId = -1;
  private storyState!: Readonly<StoryState>;
  private globalState!: GlobalState;

  // 
  private currentAction?: StoryAction;
  private actionSubscription?: Subscription;

  // walking through the action states
  private stateSubject$ = new Subject<ActionResult>();
  public state$ = this.stateSubject$.asObservable();

  // undo history
  private UndoAction: UndoState[] = [];
  private currentUndoAction?: UndoState;
  // stored seen actions and redo
  private seenActions = new Map<string, RedoState>();

  /**
   * If the current action is completed start executing the next action, 
   * if the current action is still busy tell it to speed up
   */
  nextAction() {
    if (!this.actionSubscription || this.actionSubscription.closed) {
      this.executeAction(this.nextActionId++);
    } else {
      this.currentAction?.speedup(false);
    }
  }

  private executeAction(id: number) {
    const action = story.actions.get(id);
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
          if (action.autoContinue) {
            // directly continue with next action, no need to store this state in history
            this.nextAction();
          } else {
            // store this state for undo and redo, mark as seen
            const previousState = this.storyState;
            this.storyState = finishDraft(draftState, (patches, inversePatches) => {
              // store in seenActions for redo 
              action.seenId(previousState).subscribe(seenId => {
                if (seenId) {
                  this.seenActions.set(seenId, {
                    nextActionId: this.nextActionId,
                    previousToCurrentStatePatches: patches
                  })
                }

                // if currently completed actionHistory exists: move to history and replace with current
                if (this.currentUndoAction) {
                  this.UndoAction.push(this.currentUndoAction);
                }
                this.currentUndoAction = {
                  currentActionId: action.id,
                  currentToPreviousStatePatches: inversePatches
                }
              });
            });
          }
        }
      });
    } else {
      // TODO: action does not exist, goto end of story/startpage/...?
    }
  }

  undoAction() {
    if (this.currentUndoAction) {
      this.killCurrentAction();
      this.storyState = applyPatches(this.storyState, this.currentUndoAction.currentToPreviousStatePatches);
      this.nextActionId = this.currentUndoAction.currentActionId;
      this.currentUndoAction = this.UndoAction.pop();
      this.nextAction();
    }
  }

  redoAction() {
    const nextAction = story.actions.get(this.nextActionId);
    if (nextAction) {
      // check if it was already seen
      nextAction.seenId(this.storyState).subscribe(seenId => {
        if (seenId) {
          const redoAction = this.seenActions.get(seenId);
          if (redoAction) {
            this.killCurrentAction();
            this.nextActionId = redoAction.nextActionId;
            this.storyState = applyPatches(this.storyState, redoAction.previousToCurrentStatePatches);
            this.nextAction();
          }
        }
      });
    }
  }

  private killCurrentAction() {
    this.currentAction?.speedup(true);
  }
}
