import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ElectronService } from '../../../core/services/electron.service';
import { ServiceProjectService } from '../../../core/services/service/service-project.service';
import { ServiceProjectDialogTypeEnum } from '../enums/service.project.dialog.type.enum';

@Injectable({
  providedIn: 'root'
})
export class ServiceProjectNewNameValidator {
  public constructor(private readonly electronService: ElectronService, private readonly serviceProjectService: ServiceProjectService) {}

  public bind(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors => {
      const item = this.serviceProjectService.getState.selectedItem;
      const dialogType = this.serviceProjectService.getState.dialogInfo?.dialogType;
      if (
        item &&
        [
          ServiceProjectDialogTypeEnum.newFile,
          ServiceProjectDialogTypeEnum.newDirectory,
          ServiceProjectDialogTypeEnum.newPwn,
          ServiceProjectDialogTypeEnum.newInc
        ].includes(dialogType)
      ) {
        if (!control.value) {
          return { required: true };
        }

        const pathParent = item.isDirectory
          ? item.fullPath
          : item.fullPath.substring(0, item.fullPath.lastIndexOf(this.electronService.isWin ? '\\' : '/'));
        const files = this.electronService.fs.readdirSync(pathParent);
        let resultName: string = control.value || '';
        if (dialogType === ServiceProjectDialogTypeEnum.newPwn) {
          resultName = resultName.concat('.pwn');
        } else if (dialogType === ServiceProjectDialogTypeEnum.newInc) {
          resultName = resultName.concat('.inc');
        }
        if (files.includes(resultName)) {
          return { exists: true };
        }
        return null;
      }
      return null;
    };
  }
}
