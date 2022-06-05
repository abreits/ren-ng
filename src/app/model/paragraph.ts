export class Paragraph {
  /**
   * a linear storypart is told here
   */
  constructor(
    private dialog: () => void) {
      dialog();
  }
}

const Intro = new Paragraph(() => {

});