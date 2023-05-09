import { Pipe, PipeTransform } from '@angular/core';
import { ServiceProjectItemInterface } from '../../../../libs/interfaces/service.project.item.interface';

@Pipe({
  name: 'isSelectProjectItem',
  standalone: true
})
export class IsSelectProjectItemPipe implements PipeTransform {
  public transform(selectedItems: ServiceProjectItemInterface[], item: ServiceProjectItemInterface): boolean {
    if (!selectedItems || !item) {
      return false;
    }
    return selectedItems?.findIndex((selectedItem) => selectedItem.fullPath === item.fullPath) !== -1;
  }
}
