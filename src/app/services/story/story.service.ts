import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, delay, first, Observable, of, Subject, Subscription } from 'rxjs';


export interface StoryState {
  speaker?: string;
  text?: string;
  background?: string;
  continue$?: Observable<boolean>;
}
@Injectable({
  providedIn: 'root'
})
export class StoryService implements OnDestroy {
  private static instance: StoryService | undefined;
  static appendState(storyState: StoryState): void {
    if (StoryService.instance) {
      const lastState = StoryService.instance.lastState();
      const newState = Object.assign({ ...lastState }, storyState);
      StoryService.instance.futureStates.push(newState);
    } else {
      throw new Error('StoryService not initialized')
    }
  }

  private startState = {};
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
    // this.state$.subscribe(state => {
    //   console.log('received state: ', JSON.stringify(state, null, 2))
    //   console.log('this.futureStates: ', JSON.stringify(this.futureStates, null, 2))
    //   console.log('this.currentState: ', JSON.stringify(this.currentState, null, 2))
    //   console.log('this.pastStates: ', JSON.stringify(this.pastStates, null, 2))
    // });
  }

  ngOnDestroy(): void {
    StoryService.instance = undefined;
  }

  /**
   * Execute the next story action if one is available
   * if an action is busy hard skip to the next input action
   */
  private actionSubscription: Subscription | undefined;
  nextAction = (): void => {
    if (this.actionSubscription) {
      this.skipToInputAction();
    } else {
      this.performNextAction();
    }
  }


  private skipToInputAction() {
    // halt currently actionBusy$ subscription from executing
    this.actionSubscription!.unsubscribe();
    this.actionSubscription = undefined;
    // skip to the first action without continue$
    let nextState: StoryState | undefined;
    while (this.futureStates.length > 0) {
      nextState = this.futureStates.shift();
      if (!nextState?.continue$) break;
      this.pastStates.push(this.currentState);
      this.currentState = nextState!;
    }
    this.setState(nextState);
  }

  private performNextAction(): void {
    const nextState = this.futureStates.shift();
    this.setState(nextState);
  };

  private setState(state: StoryState | undefined) {
    if (state) {
      this.pastStates.push(this.currentState);
      this.currentState = state;
      this.stateSubject$.next(state);
      if (state.continue$) {
        // automatically switch to next state after this one has completed
        if (this.actionSubscription) throw new Error('nextAction$ should be undefined!');
        this.actionSubscription = state.continue$.pipe(first(), delay(0)).subscribe(() => {
          this.actionSubscription = undefined;
          this.nextAction();
        });
      }
    }
  }

  /**
   * Execute the next story action if one is available, only performs actions based on history settings
   */
  nextHistoryAction = (): void => {
    console.log('nextHistoryAction');
  };

  /**
   * Roll back to the previous story input action if it is available
   */
  previousAction = (): void => {
    // halt possible actionBusy$ subscription from executing
    this.actionSubscription?.unsubscribe();
    this.actionSubscription = undefined;

    // get previous input action
    while (this.pastStates.length > 0) {
      this.futureStates.unshift(this.currentState);
      this.currentState = this.pastStates.pop()!;
      if (!this.currentState?.continue$) break;
    }
    this.stateSubject$.next(this.currentState);
  }

  private lastState(): StoryState | undefined {
    const lastFuture = this.futureStates.at(-1);
    return lastFuture ? lastFuture : this.pastStates.at(-1);
  }
}

export function text(text: string, speaker?: string) {
  StoryService.appendState({ speaker, text, continue$: undefined });
}

export function background(background: string, continueAfter$?: Observable<boolean>) {
  let continue$ = of(true);
  if (continueAfter$) {
    continue$ = continueAfter$;
  }
  StoryService.appendState({ speaker: '', text: '', background, continue$ });
};

export const testStory = () => {
  background('black');
  text('text-area works! this is a multiline text and should be rendered as such this is a extra text to make it long enough for multiple lines');
  text('second line with the same background');
  text('and now with a narrator', 'Narrator');
  background('blue', of(true).pipe(delay(5000)));
  background('yellow', of(true).pipe(delay(5000)));
  background('white');
  text('This is a text with a different background', 'Test');
  background('red', of(true).pipe(delay(1000)));
  background('green');
  // text('THE END!');
}
