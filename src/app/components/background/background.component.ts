import { Component, OnInit } from '@angular/core';

import { StoryService, testStory } from 'src/app/services/story/story.service';

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss']
})
export class BackgroundComponent implements OnInit {

  constructor(
    public story: StoryService
  ) { }

  ngOnInit(): void {
    testStory();
  }

  setBackground(color?: string): { [klass: string]: any; } | null {
    if (color) {
      return {
        "background-color": color
      }
    } else {
      return null;
    }
  }

  displayState(source: any): string {
    return JSON.stringify(source, null, 2);
  }

}
