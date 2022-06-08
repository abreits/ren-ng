# Actions

The default action functions that are available for a virtual novel game are:
- text, the most used action, displays a text an optionally the actor that says it
- background, display a background image, can be an animation
- selection, display a selection
The text action displays a text action on the display an then waits for the next action to start
text:
- A: the text is fully displayed, nextAction should start the next action
  - if the text has been displayed previously with the same relevant currentState
    - if fastSkipUnseenText is on, 
      fastSkip should proceed to the next action after a fastSkipDuration interval
    - if fastSkipUnseenText is off, 
      fastSkip do nothing
- B: the text is not fully displayed (in the process of being fully displayed), 
  - nextAction (space bar or mouse click) should go to situation A

## Action categories

background:
- A: the correct background has finalized displaying,
   - nextAction should automatically start
   - if fastSkipMinigames is on fastSkip should proceed to the next action
- B: the correct background is busy (animating)
   - nextAction (space bar or mouse click) should go to situation A

selection:
- A: the selection options are visible
   - nextAction should do nothing,
   - wait for a selection to take place and set nextAction id to the selected option
- B: the selection options are in the process of being shown (display animation)
   - nextAction (space bar or mouse click) should go to situation A
- C: the selection has been displayed previously with the same relevant currentState
   nextAction should do nothing
   - if fastSkipSelections is off, fastSkip should do nothing
   - if fastSkipSelections is on, fastSkip should use the cached resultState for this action
     and proceed to the next action after a fastSkipDuration interval

minigame:
- A: the minigame is starting
   - nextAction should do nothing
   - wait for the game to complete and set the nextAction id to the returned option
- B: the minigame start animation is running
   - nextAction (space bar or mouse click) should go to situation A
- C: the minigame has been played previously from the same relevant currentState
   - default:
     - nextAction (space bar or mouse click) should go to situation A
     - if fastSkipMinigames is off, fastSkip should do nothing
     - if fastSkipMinigames is on fastSkip (ctrl) should use the cached resultState for this action
       and proceed to the next action after a fastSkipDuration interval
   - or allow the minigame to determine what to do, e.g.

modify state:
- A:
     
quit game:
- A: endgame page is displayed
   - nextAction should do nothing
   - pressing the end game button should return to the application start page
- B: endgame page animation is running
   nextAction (space bar or mouse click) should go to situation A

## abstract action superclass

The abstract action superclass must be able to facilitate all basic functionality of the actions defined in the action categories. 

This means the following activities must be iplemented:
- A: The state modification is complete
- B: The state modification is in progress
- C: The state modification's relevant currentState was already processed before, if the state is marked as cachable a cached version of the result should be available

In order to determine if an action has already taken place in the past, a hash needs to be created that uniquely identifies the action and its relavant state. for this the abstract actions needs a method that delivers this hash:
- hashActionState(currentState) => hash the action name and the relevant currentState variables (defaults to the full story state) and return the result

When a storyAction is executed an observable is started that returns a stable story state and the next action(id) when completed:
- execute(currentState: StoryState): Observable<{nextActionId, newStoryState}>

After the execute completes:
- Mark the current storyAction-storyState combination as seen:
  - if the storyAction can have more than one result call the hashActionState(currentState) method and store the result as:
      - global seenMap\<string, StoryState | undefined>.set(hash, resultState)
  - else call the hashActionState(currentState) method and store the result as (re-executing the action should always result in the same resultState, so we should not need to store the result):
      - global seenMap\<string, StoryState | undefined>.set(hash, undefined)
- If the current action automatically starts the next action (e.g. background):
  - story.nextAction()

    Adds the currentAction to the history to the story:
    - story history.push({currentActionId, currentState})
    Executes the next action:
    - story currentAction = storyMap.get(nextActionId)
    - story currentAction.execute(newState)

TODO: check if everything is complete (probably forgot a few things :)

If the current storyAction automatically continues in the next storyAction, we need to execute the next storyAction

When the nextAction is requested (by the user pressing space, automatically after a wait etc.) we need to check if the storyAction is still busy:
- isBusy(): boolean

  If it is busy we need to urge it to speed up execution (whether this is possible depends on the type of storyAction):
  - speedUp(): void

  If it is not busy we must execute the action corresponding to the nextActionId with the new story state.

## global

if nextState does not exist goto end game

When back/forward tracking, only the A option states should be saved in the history

Backtracking a single step should skip all autocontinue nextAction actions (only background actions for now)

## global settings (state) for this system
  - fastSkipUnseenText: boolean, fastSkip also skips unread texts
  - fastSkipSelection: boolean, fastSkip also skips to the last previously taken selection
  - fastSkipMinigame: boolean, fastSkip also skips to the last played minigame result
  - autoFastSkip: boolean (automatically fastskips all activated fastskips)
  - fastskipWait: number, the minimal wait between fastskips in ms
  - autoNextAction: boolean, automatically perform a nextAction when in state A
  - autoNextActionWait: number, wait in ms before performing the nextAction
