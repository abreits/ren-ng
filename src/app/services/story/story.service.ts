import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


export interface StoryState {
  speaker?: string;
  text?: string;
  background?: string;
  pause: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class StoryService {
  private static instance?: StoryService;
  static appendState(storyState: StoryState): void {
    if (StoryService.instance) {
      const lastState = StoryService.instance.lastState();
      const newState = { ...storyState, lastState }
      StoryService.instance.futureStates.push(newState);
    } else {
      throw new Error('StoryService not initialized')
    }
  }

  private startState = { pause: false };
  private stateSubject$ = new BehaviorSubject<StoryState>(this.startState);
  public state$ = this.stateSubject$.asObservable();

  // history to keep track of story states to tell and story states told
  private futureStates: StoryState[] = [];
  private currentState: StoryState = this.startState;
  private pastStates: StoryState[] = [];

  constructor() {
    if (StoryService.instance) throw new Error('StoryService already initialized');
    StoryService.instance = this;

    // debugging
    this.state$.subscribe(state => console.log('storyState: ', state));
  }

  /**
   * Execute the next story action if one is available
   */
  nextAction = (): void => {
    console.log('nextAction');
    const nextState = this.futureStates.shift();
    if (nextState) {
      this.pastStates.push(this.currentState);
      this.currentState = nextState;
      this.stateSubject$.next(nextState);
    }
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
    const lastState = this.pastStates.pop();
    if (lastState) {
      this.futureStates.unshift(this.currentState);
      this.currentState = lastState;
      this.stateSubject$.next(lastState);
    }
  }

  private lastState(): StoryState | undefined {
    const lastFuture = this.futureStates.at(-1);
    return lastFuture ? lastFuture : this.pastStates.at(-1);
  }
}

export function say(speaker: string | undefined = undefined, text: string) {
  StoryService.appendState({ speaker, text, pause: true });
}

export function background(background: string, pause = false) {
  StoryService.appendState({ background, pause });
};

export const testStory = () => {
  background('black');
  background('white');
  background('red');
  background('green');
}
