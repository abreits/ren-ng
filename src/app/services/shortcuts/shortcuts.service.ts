import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { EventManager } from '@angular/platform-browser';

import { combineLatest, distinctUntilChanged, filter, fromEvent, merge, Observable, share, Subscription } from 'rxjs';

import { StoryService } from '../story/story.service';
import { fromShortcut, KeyCode } from './model/keyboard';

/**
 * Keyboard and mouse shortcuts
 */
@Injectable({
  providedIn: 'root'
})
export class ShortcutsService implements OnDestroy {
  private subscriptions: Subscription[] = [];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private eventManager: EventManager,
    private story: StoryService
  ) {
    this.enable();
  }

  ngOnDestroy(): void {
    this.disable();
  }

  public enable(): void {
    this.addMouseEvent('click', () => console.log('click!'));
    this.addMouseEvent('wheel', (event: UIEvent) => console.log('wheel', event));
    this.addKeyEvent('Space', this.story.nextAction);
    this.addKeyEvent('Escape', (event: UIEvent) => console.log('escape', event));
  }

  public disable(): void {
    this.subscriptions.map(subscription => subscription.unsubscribe());
    this.subscriptions = [];
  }

  private addMouseEvent(event: string, action: (e: any) => any | void) {
    this.subscriptions.push(fromEvent(this.document, event).subscribe(action));
  }

  private addKeyEvent(event: KeyCode | KeyCode[], action: (e: any) => any | void) {
    this.subscriptions.push(fromShortcut(event).subscribe(action));
  }
}
