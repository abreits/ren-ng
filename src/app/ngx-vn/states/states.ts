import { Patch } from 'immer';

import { BackgroundActionParams, TextActionParams } from '@ngx-vn/actions';

/**
 * Interface definitions of the various state keeping structures used
 */

/**
 * the state of actions needed for the front-end display to know
 */
export interface ActionState {
  text: Partial<TextActionParams>;
  background: Partial<BackgroundActionParams>;
  location: unknown;
  //... etc.
}

/**
 * current story state, observed in history
 */
export interface StoryState<Stats = unknown> {
  // story generic categories
  action: Partial<ActionState>;
  actors: unknown;
  locations: unknown;
  quests: unknown;
  // story custom category 
  stats: Stats;
}


export class GlobalState {
  letterInterval = 0; // wait between displaying each letter in ms
  fastSkipUnseenText = false; // fastSkip also skips unread texts
  fastSkipSelection = false; // fastSkip also skips to the last previously taken selection
  fastSkipMinigame = false; // fastSkip also skips to the last played minigame result
  autoFastSkip = false; // automatically fastskips all activated fastskips
  fastskipInterval = 200; // the minimal wait between fastskips in ms
  autoNextAction = false; // automatically perform a nextAction when an action has completed
  autoNextActionWait = 5000; // wait in ms before performing the nextAction

  // seenMap: Map<string, UndoState>;

  // *** Add your global custom state variables below ***
}

// needed for the undo, the final state of the executed action and the next state to go to
export interface UndoState {
  currentActionId: number;
  currentToPreviousStatePatches: Patch[];
}

// needed for the redo
export interface RedoState {
  nextActionId: number;
  previousToCurrentStatePatches: Patch[];
}
