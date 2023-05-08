import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ElectronService } from '../../../core/services/electron.service';
import { ServiceProjectService } from '../../../core/services/service/service-project.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceProjectNewNameValidator {
  public constructor(private readonly electronService: ElectronService, private readonly serviceProjectService: ServiceProjectService) {}

  public bind(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors => {
      const item = this.serviceProjectService.getState.selectedItem;
      if (item) {
        const isWin = item.fullPath.includes('\\');
        const pathParent = item.isDirectory ? item.fullPath : item.fullPath.substring(0, item.fullPath.lastIndexOf(isWin ? '\\' : '/'));
        const files = this.electronService.fs.readdirSync(pathParent);
        if (files.includes(control.value)) {
          return { exists: true };
        }
        return null;
      }
      return null;
    };
  }
}
