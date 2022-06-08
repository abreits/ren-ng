import { BehaviorSubject, Observable, Subject } from "rxjs";

export const startState: PublishState = {
  story: {
    actor: 'test actor',
    text: '',
    background: 'black',

    stats: null
  }
}

export const state$ = new BehaviorSubject(startState);

// todo: make mandatory, 
export interface PublishState {
  story?: StoryState;
  global?: GlobalState
}

// needed for the history, the final state of the executed action and the next state to go to
interface HistoryState {
  nextActionId: number;
  state: PublishState;
}
interface StoryState {

  actor: string;
  text: string;
  background: string;

  // custom stats
  stats: any; // TODO: make it easy for users to define their own story stats
  temp?: any; // temporary
}

interface StatState {
  // user defined stats
}


interface GlobalState {
  fastSkipUnseenText: boolean; // fastSkip also skips unread texts
  fastSkipSelection: boolean; // fastSkip also skips to the last previously taken selection
  fastSkipMinigame: boolean; // fastSkip also skips to the last played minigame result
  autoFastSkip: boolean; // automatically fastskips all activated fastskips
  fastskipWait: number; // the minimal wait between fastskips in ms
  autoNextAction: boolean; // automatically perform a nextAction when in state A
  autoNextActionWait: number; // wait in ms before performing the nextAction

  seenMap: Map<string, StoryState>;

  // *** Add your global custom state variables below ***

}