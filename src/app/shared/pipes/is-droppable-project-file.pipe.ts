import { Pipe, PipeTransform } from '@angular/core';
import { ServiceProjectItemInterface } from '../../../../libs/interfaces/service.project.item.interface';
import { ElectronService } from '../../core/services/electron.service';

@Pipe({
  name: 'isDroppableProjectFile',
  standalone: true
})
export class IsDroppableProjectFilePipe implements PipeTransform {
  public constructor(private readonly electronService: ElectronService) {}

  public transform(selectedItems: ServiceProjectItemInterface[], item: ServiceProjectItemInterface): boolean {
    if (!item.isDirectory) {
      return false;
    }

    if (selectedItems?.some((selectedItem) => selectedItem.fullPath === item.fullPath)) {
      return false;
    }

    if (
      selectedItems.every(
        (selectedItem) =>
          item.fullPath === selectedItem.fullPath.slice(0, selectedItem.fullPath.lastIndexOf(this.electronService.isWin ? '\\' : '/'))
      )
    ) {
      return false;
    }

    return true;
  }
}
