import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appExternalEvents]',
  standalone: true
})
export class ExternalEventsDirective {
  @Output() public onClickExternal = new EventEmitter<EventTarget>();
  @Output() public onContextMenuExternal = new EventEmitter<EventTarget>();

  public constructor(private readonly el: ElementRef) {}

  @HostListener('document:click', ['$event'])
  public onClick(event: Event) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.onClickExternal.emit(event.target);
    }
  }

  @HostListener('document:contextmenu', ['$event'])
  public onContextMenu(event: Event) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.onContextMenuExternal.emit(event.target);
    }
  }
}
