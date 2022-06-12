import { StatState } from './stat-state';
import {ActionState, GlobalState, StoryState} from './states';

/**
 * fixtures of the various story state types and interfaces,
 * for use in unittests
 */

export function getActionStateFixture(): ActionState {
  return {
    text: {},
    background: {},
    location: {}
  };
}

export function getStoryStateFixture(): StoryState {
  return {
    action: {},
    actors: undefined,
    locations: undefined,
    quests: undefined,
    stats: new StatState()
  };
}

export function getGlobalStateFixture(): GlobalState {
  return {
    letterInterval: 0,
    fastSkipUnseenText: false,
    fastSkipSelection: false,
    fastSkipMinigame: false,
    autoFastSkip: false,
    fastskipInterval: 200,
    autoNextAction: false,
    autoNextActionWait: 5000
  };
}