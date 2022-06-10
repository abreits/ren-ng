import { Patch } from "immer";
import { BackgroundActionParams, TextActionParameters } from "../actions/actions";
import { StatState } from "./stat-state";

/**
 * Interface definitions of the various state keeping structures used
 */

/**
 * the state of actions needed for the front-end display to know
 */
export interface ActionState {
  text: Partial<TextActionParameters>;
  background: Partial<BackgroundActionParams>;
  location: any;
  //... etc.
}

/**
 * current story state, observed in history
 */
export interface StoryState {
  // story generic categories
  action: Partial<ActionState>;
  actors: any;
  locations: any;
  quests: any;
  // story custom category 
  stats: StatState;
}


export interface GlobalState {
  textSpeed: number; // wait between displaying each letter in ms
  fastSkipUnseenText: boolean; // fastSkip also skips unread texts
  fastSkipSelection: boolean; // fastSkip also skips to the last previously taken selection
  fastSkipMinigame: boolean; // fastSkip also skips to the last played minigame result
  autoFastSkip: boolean; // automatically fastskips all activated fastskips
  fastskipWait: number; // the minimal wait between fastskips in ms
  autoNextAction: boolean; // automatically perform a nextAction when in state A
  autoNextActionWait: number; // wait in ms before performing the nextAction

  seenMap: Map<string, UndoState>;

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