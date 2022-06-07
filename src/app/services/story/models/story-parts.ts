// story-parts.ts ** this file contains the base classes that are needed for the story to progress

import { Observable, of } from "rxjs";

// a story action is everything that can be

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
    return '';
  }
}



// main types of story actions:
//   display/clear/hide text
//   display/animate background
//   display choice
//   perform custom action (e.g. a game)





// all storyActions are placed in the StoryMap
// on start the StoryAction with id 0 is started
// by default the next storyAction is the action with id+1
// 