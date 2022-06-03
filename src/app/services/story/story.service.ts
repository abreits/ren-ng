import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StoryService {

  constructor() { }

  /**
   * Execute the next story action if one is available
   */
  nextAction = (): void => {
    console.log('nextAction');
  };

  /**
   * Execute the next story action if one is available, only performs actions based on history settings
   */
  nextHistoryAction = (): void => {
    console.log('nextHistoryAction');
  };

  /**
   * Roll back to the previous story action if it is available
   */
  previousAction = (): void => {
    console.log('previousAction');
  }
}
