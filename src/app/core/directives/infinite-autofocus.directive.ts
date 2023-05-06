import { AfterViewInit, Directive, ElementRef, HostListener, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appInfiniteAutofocus]',
  standalone: true
})
export class InfiniteAutofocusDirective implements AfterViewInit, OnChanges {
  @Input() public isModal = false;
  @Input() public isShowModal = false;

  public constructor(private readonly el: ElementRef) {}

  public ngAfterViewInit() {
    if (!this.isModal) {
      setTimeout(() => {
        this.onFocus();
      }, 0);
    }
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.isShowModal?.currentValue && this.isModal) {
      setTimeout(() => {
        this.onFocus();
      }, 0);
    }
  }

  public onFocus() {
    (this.el.nativeElement as HTMLElement).focus();
  }

  @HostListener('document:mousedown', ['$event.target'])
  public onMousedown(target: any) {
    if (!(this.el.nativeElement as HTMLElement).contains(target) && ((this.isModal && this.isShowModal) || !this.isModal)) {
      setTimeout(() => {
        this.onFocus();
      }, 0);
    }
  }
}
