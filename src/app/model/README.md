# Story model

Brainstorm, work in progress
The story model consists of several parts that together should make story telling easier. the main parts are:

- StoryLine: 
- Person: the people in the story
- Location: the various locations available in the story
- Quest: the quests that can be active in the story
- Stats: global, story, person, location or quest related stats that influence the story
- Text: part of the story, optionally told by a person, also optionally with modifiers, e.g. for thinking, shouting, whispering etc.
- Background: fullscreen background text or animation, optionally waiting a certain amount of time or for completion before displaying the next StoryLineElement
- Action: part of the story where input is required (choice, minigame, etc.) and possibly stats are changed

## Person
A person can have a:
- gender (male, female, other)
- FirstName (string)
- Surname (string)
- formal title, e.g. doctor, sir
- 

## Quest
A quest has a:
- name, 
- description,
- status (invisible, inactive, active, completed)
- questSteps
- currentStep

### QuestStep
A queststep has a
- trigger (method that returns true or false)
- action, the action to be performed when the trigger is true
- completed (booleasn to indicate the step was completed)

Storyline consist of a list of StoryLineElement's

A StoryLineElement is an elemet in the story that does not need user interaction (other than sometimes to wait for the user to proceed to the next element)

StoryLine elements determinde so far are:
- Text
- Background
- (Person)Animation: display, hide, move to location, move in or out of screen, etc. 
