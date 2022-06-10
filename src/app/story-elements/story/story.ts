import { StoryAction } from '../actions/abstract-story-action/abstract-story-action';

/**
 * class containing the whole story
 */
class Story {
  private id = 0;
  private mutableActions = new Map<number, StoryAction>();

  public readonly actions: ReadonlyMap<number, StoryAction> = this.mutableActions;

  get nextId() {
    return this.id;
  }

  appendAction(storyAction: StoryAction): number {
    storyAction.id = this.id;
    this.mutableActions.set(this.id, storyAction);
    return this.id++;
  }
}

export const story = new Story();
