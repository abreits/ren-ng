import { Observable, fromEvent, merge, distinctUntilChanged, share, filter, combineLatest } from "rxjs";

export type KeyCode =
  'KeyA' |
  'KeyB' |
  'KeyC' |
  'KeyD' |
  'KeyE' |
  'KeyF' |
  'KeyG' |
  'KeyH' |
  'KeyI' |
  'KeyJ' |
  'KeyK' |
  'KeyL' |
  'KeyM' |
  'KeyN' |
  'KeyO' |
  'KeyP' |
  'KeyQ' |
  'KeyR' |
  'KeyS' |
  'KeyT' |
  'KeyU' |
  'KeyV' |
  'KeyW' |
  'KeyX' |
  'KeyY' |
  'KeyZ' |
  'Digit0' |
  'Digit1' |
  'Digit2' |
  'Digit3' |
  'Digit4' |
  'Digit5' |
  'Digit6' |
  'Digit7' |
  'Digit8' |
  'Digit9' |
  'F1' |
  'F2' |
  'F3' |
  'F4' |
  'F5' |
  'F6' |
  'F7' |
  'F8' |
  'F9' |
  'F10' |
  'F11' |
  'F12' |
  'F13' |
  'F14' |
  'F15' |
  'F16' |
  'F17' |
  'F18' |
  'F19' |
  'F20' |
  'MetaLeft' |
  'AltLeft' |
  'ShiftLeft' |
  'ControlLeft' |
  'MetaRight' |
  'AltRight' |
  'ShiftRight' |
  'ControlRight' |
  'ArrowRight' |
  'ArrowUp' |
  'ArrowLeft' |
  'ArrowDown' |
  'Function' |
  'Delete' |
  'Home' |
  'End' |
  'PageUp' |
  'PageDown' |
  'Backquote' |
  'CapsLock' |
  'Tab' |
  'Space' |
  'Backspace' |
  'Enter' |
  'Escape' |
  'Backslash' |
  'Comma' |
  'Equal' |
  'BracketLeft' |
  'Minus' |
  'Period' |
  'Quote' |
  'BracketRight' |
  'Semicolon' |
  'Slash' |
  'Numpad0' |
  'Numpad1' |
  'Numpad2' |
  'Numpad3' |
  'Numpad4' |
  'Numpad5' |
  'Numpad6' |
  'Numpad7' |
  'Numpad8' |
  'Numpad9' |
  'NumLock' |
  'NumpadEqual' |
  'NumpadDivide' |
  'NumpadMultiply' |
  'NumpadSubtract' |
  'NumpadAdd' |
  'NumpadEnter' |
  'NumpadDecimal';

/**
 * Observable for global keycode shortcuts
 * 
 * code copied from https://notiz.dev/blog/simple-rxjs-keyboard-shortcuts
 */
export function fromShortcut(shortcut: KeyCode | KeyCode[]): Observable<KeyboardEvent[]> {
  // Observables for all keydown and keyup events
  const keyDown$ = fromEvent<KeyboardEvent>(document, 'keydown');
  const keyUp$ = fromEvent<KeyboardEvent>(document, 'keyup');

  // All KeyboardEvents - emitted only when KeyboardEvent changes (key or type)
  const keyEvents$ = merge(keyDown$, keyUp$).pipe(
    distinctUntilChanged((keyDown, keyUp) => keyDown.code === keyUp.code && keyDown.type === keyUp.type),
    share()
  );

  // Create KeyboardEvent Observable for specified KeyCode
  const createKeyPressStream = (charCode: KeyCode) =>
    keyEvents$.pipe(filter((event) => event.code === charCode));

  // Create Event Stream for every KeyCode in shortcut
  let keyCodeEvents$: Observable<KeyboardEvent>[];
  if (Array.isArray(shortcut)) {
    keyCodeEvents$ = shortcut.map((keycode) => createKeyPressStream(keycode));
  } else {
    keyCodeEvents$ = [createKeyPressStream(shortcut)];
  }

  // Emit when specified keys are pressed (keydown).
  // Emit only when all specified keys are pressed at the same time.
  // More on combineLatest below
  return combineLatest(keyCodeEvents$).pipe(
    filter<KeyboardEvent[]>((arr) => arr.every((a) => a.type === 'keydown'))
  );
}
