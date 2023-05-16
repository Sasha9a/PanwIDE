import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { Key } from 'ts-key-enum';

@Component({
  selector: 'app-list-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-box.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListBoxComponent<T> implements OnChanges {
  @ContentChild('itemTemplate') public itemTemplate;

  @Input() public options: T[];

  @Input() public focusedItem: T;
  @Output() public focusedItemChange = new EventEmitter<T>();

  @Input() public selectedItem: T;
  @Output() public selectedItemChange = new EventEmitter<T>();

  @Input() public class: string;

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedItem?.currentValue) {
      this.focusedItem = this.selectedItem;
    }
  }

  @HostListener('window:keydown', ['$event'])
  public onKeyDown(event: KeyboardEvent) {
    const findIndexOption = this.options.findIndex((opt) => opt === this.focusedItem);

    if (findIndexOption === -1) {
      this.focusedItem = this.options?.[0];
      return;
    }

    if (event.key === Key.ArrowDown) {
      if (findIndexOption === this.options?.length - 1) {
        this.focusedItem = this.options[0];
      } else {
        this.focusedItem = this.options[findIndexOption + 1];
      }
      this.focusedItemChange.emit(this.focusedItem);
    } else if (event.key === Key.ArrowUp) {
      if (!findIndexOption) {
        this.focusedItem = this.options[this.options.length - 1];
      } else {
        this.focusedItem = this.options[findIndexOption - 1];
      }
      this.focusedItemChange.emit(this.focusedItem);
    } else if (event.key === Key.Enter) {
      this.selectedItem = this.focusedItem;
      this.selectedItemChange.emit(this.selectedItem);
    }
  }

  public onClickItem(item: T) {
    this.focusedItem = item;
    this.selectedItem = item;
    this.selectedItemChange.emit(this.selectedItem);
  }

  public onMouseEnter(item: T) {
    this.focusedItem = item;
    this.selectedItem = item;
    this.focusedItemChange.emit(this.focusedItem);
  }
}
