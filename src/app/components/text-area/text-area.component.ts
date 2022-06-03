import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

import { StoryService } from 'src/app/services/story/story.service';

@Component({
  selector: 'app-text-area',
  animations: [
    trigger('displayHide', [
      state('display', style({
        top: '75%',
        bottom: '0%',
        opacity: '100%'
      })),
      state('hide', style({
        top: '100%',
        bottom: '-25%',
        opacity: '0%'
      })),
      transition('display => hide', [
        animate('0.2s')
      ]),
      transition('hide => display', [
        animate('0.2s')
      ])
    ])
  ],
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.scss']
})
export class TextAreaComponent implements OnInit {
  hide = false;

  constructor(
    story: StoryService
  ) { }

  ngOnInit(): void {
  }

  toggle(): void {
    this.hide = !this.hide;
  }

  toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }
}
