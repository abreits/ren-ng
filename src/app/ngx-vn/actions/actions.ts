import { BackgroundActionParams } from "./background/background.action";
import { TextActionParams } from "./text/text.action";


/**
 * the state of actions needed for the front-end display to know
 */
 export interface ActionState {
  text: Partial<TextActionParams>;
  background: Partial<BackgroundActionParams>;
  location: unknown;
  //... etc.
}

export class BasicStoryActions<Stats = undefined> {
  
}