import { StoryAction } from '@ngx-vn/actions/abstract-story-action';

/**
 * class containing the whole story
 */

export let story: Story;
class Story {
  private id = 0;
  private mutableActions = new Map<number, StoryAction>();

  public readonly actions: ReadonlyMap<number, StoryAction> = this.mutableActions;

  constructor() {
    // export to global story for action functions
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    story = this;
  }

  get nextId() {
    return this.id;
  }

  appendAction(storyAction: StoryAction): number {
    storyAction.id = this.id;
    this.mutableActions.set(this.id, storyAction);
    return this.id++;
  }
}

export class Section {
  readonly sectionStart: number;
  readonly sectionEnd: number;

  constructor(
    createContent: (vn: any) => void
  ) {
    this.sectionStart = story.nextId;
    createContent();
    this.sectionEnd = story.nextId;
    // todo: create empty return/jump action, to be filled later
  }
}
/**
 * test vn variabl that prefixes all actions
 */
export const vn: any = {};