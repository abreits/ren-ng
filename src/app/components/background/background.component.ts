import { Component, OnInit } from '@angular/core';

import { StoryService } from 'src/app/services/story/story.service';

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss']
})
export class BackgroundComponent implements OnInit {

  constructor(
    story: StoryService
  ) { }

  ngOnInit(): void {
  }

}
