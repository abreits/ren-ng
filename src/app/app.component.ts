import { Component } from '@angular/core';
import { ShortcutsService } from './services/shortcuts/shortcuts.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ren-ng';

  constructor (
    private shortcuts: ShortcutsService
  ){}
}
