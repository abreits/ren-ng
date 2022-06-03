// story-parts.ts ** this file contains the base classes that are needed for the story to progress

// a story action is everything that can be

export class StoryStateManager {
  // needs a history for easy undo/redo
  // needs a hashset to determine which actions have been performed before

  // different basic states that are needed to keep the state:
  //  - person actions (speak, enter, leave etc.)
  //  - background actions (display, fade in/out, scroll/zoom etc.)
  //  - story variables (stats)
  // every individual state update generates updates the active state
  // a state is only added to history after a user action has performed (next text, select option etc.)
  // custom actions can tak some time, but should only store their results as a new state
  // option for random events to create the same result every time based on initial rnd number

  /**
   * Progresses to the next story action if possible
   */
  next(): boolean {
    return false;
  }

  /**
   * Returns to the previous story action if possible
   */
  previous(): boolean {
    return false;
  }

  /**
   * Check if the specified action already has been performed in the past
   */
  performed(action: StoryAction): boolean {
    return false;
  }
}

/**
 * global stats and settings, stored only once
 */
export class GlobalStats {
  performedActions = new Set<string>();

  uxSettings: any; // TODO: the default configurable ux settings
  autoSkipRead = false;
  autoSkipReadSpeed = 500; // ms
  skipUnread = false;
  skipChoices = false;
}

/**
 * 
 */
export class StoryStats {
  /**
   * Create a unique hash of the story variables that impact story actions
   */
  hash(): string {
    // by default the story variables do not impact 
    return '' ;
  }
}

// main types of story actions:
//   display/clear/hide text
//   display/animate background
//   display choice
//   perform custom action (e.g. a game)
export class StoryAction {
  canSkipThrough = true;
}