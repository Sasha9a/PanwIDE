import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ElectronService } from '../../../core/services/electron.service';
import { ServiceProjectService } from '../../../core/services/service/service-project.service';
import { ServiceProjectDialogTypeEnum } from '../enums/service.project.dialog.type.enum';

@Injectable({
  providedIn: 'root'
})
export class ServiceProjectNewFileNameValidator {
  public constructor(private readonly electronService: ElectronService, private readonly serviceProjectService: ServiceProjectService) {}

  public bind(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors => {
      const item = this.serviceProjectService.getState.selectedItem;
      const dialogType = this.serviceProjectService.getState.dialogInfo?.dialogType;
      if (
        item &&
        [ServiceProjectDialogTypeEnum.newFile, ServiceProjectDialogTypeEnum.newPwn, ServiceProjectDialogTypeEnum.newInc].includes(
          dialogType
        )
      ) {
        const isWin = item.fullPath.includes('\\');
        const pathParent = item.isDirectory ? item.fullPath : item.fullPath.substring(0, item.fullPath.lastIndexOf(isWin ? '\\' : '/'));
        const files = this.electronService.fs.readdirSync(pathParent);
        if (files.includes(control.value)) {
          return { existsFile: true };
        }
        return null;
      }
      return null;
    };
  }
}
