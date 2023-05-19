import { Pipe, PipeTransform } from '@angular/core';
import { ServiceProjectItemInterface } from '../../../../libs/interfaces/service.project.item.interface';

@Pipe({
  name: 'isDroppableProjectFile',
  standalone: true
})
export class IsDroppableProjectFilePipe implements PipeTransform {
  public transform(selectedItems: ServiceProjectItemInterface[], item: ServiceProjectItemInterface): boolean {
    if (!item.isDirectory) {
      return false;
    }

    if (selectedItems?.some((selectedItem) => selectedItem.fullPath === item.fullPath)) {
      return false;
    }

    if (item.children?.some((childItem) => selectedItems?.some((selectedItem) => selectedItem.name === childItem.name))) {
      return false;
    }

    return true;
  }
}
