import { ActionSource, StoryAction } from './abstract-story-action';

/**
 * Create test action class to test the abstract StoryAction
 */
export class TestStoryAction extends StoryAction {
  updateState(update: ActionSource): void {
    // dummy test result to check changes
    update.story.action.text = {
      text: 'called once'
    }
    update.publish();
    update.story.action.text = {
      text: 'called twice'
    }
    update.publish();
    update.complete();
  }
}

describe('StoryAction', () => {
  it('should create', () => {
    // TODO:
  });
});

describe('ActionSource', () => {
  it('should create', () => {
    // TODO:
  });

  describe('publish()', () => {
    it('should publish itself to results$ after calling', () => {
      // TODO:
    });
  });

  describe('complete()', () => {
    it('should complete the results$ and interrupts$ subjects', () => {
      // TODO:
    });
  });
});
