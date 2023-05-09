import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ElectronService } from '../../../core/services/electron.service';
import { ServiceProjectService } from '../../../core/services/service/service-project.service';
import { ServiceProjectDialogTypeEnum } from '../enums/service.project.dialog.type.enum';

@Injectable({
  providedIn: 'root'
})
export class ServiceProjectRenameFileValidator {
  public constructor(private readonly electronService: ElectronService, private readonly serviceProjectService: ServiceProjectService) {}

  public bind(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors => {
      const selectedItems = this.serviceProjectService.getState.selectedItems;
      const dialogType = this.serviceProjectService.getState.dialogInfo?.dialogType;
      if (selectedItems?.length && dialogType === ServiceProjectDialogTypeEnum.rename) {
        if (!control.value) {
          return { required: true };
        }

        const selectedItem = selectedItems[0];
        const pathParent = selectedItem.fullPath.substring(0, selectedItem.fullPath.lastIndexOf(this.electronService.isWin ? '\\' : '/'));
        const files = this.electronService.fs.readdirSync(pathParent);
        let resultName: string = control.value || '';
        if (files.includes(resultName)) {
          return { exists: true };
        }
        return null;
      }
      return null;
    };
  }
}
