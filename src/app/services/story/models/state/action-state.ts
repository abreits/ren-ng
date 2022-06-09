import { Patch } from "immer";
import { Observable } from "rxjs";

/**
 * The publishState contains state for every action type. 
 * This state can be received and acted upon by front-end components
 * Only one action is supposed to be active at any time
 */

/**
 * the state of actions needed for the front-end display to know
 */
export interface ActionState {
  text: any;
  background: any;
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
  stats: any;
}

// needed for the history, the final state of the executed action and the next state to go to
export interface HistoryState {
  nextActionId: number;
  previousToCurrentStatePatches: Patch[];
  currentToPreviousStatePatches: Patch[];
}

interface StatState {
  // user defined stats
}


export interface GlobalState {
  fastSkipUnseenText: boolean; // fastSkip also skips unread texts
  fastSkipSelection: boolean; // fastSkip also skips to the last previously taken selection
  fastSkipMinigame: boolean; // fastSkip also skips to the last played minigame result
  autoFastSkip: boolean; // automatically fastskips all activated fastskips
  fastskipWait: number; // the minimal wait between fastskips in ms
  autoNextAction: boolean; // automatically perform a nextAction when in state A
  autoNextActionWait: number; // wait in ms before performing the nextAction

  seenMap: Map<string, HistoryState>;

  // *** Add your global custom state variables below ***

}