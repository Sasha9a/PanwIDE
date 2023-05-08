import { ApplicationRef, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ServiceProjectItemInterface } from '../../../../../libs/interfaces/service.project.item.interface';
import { ServiceProjectDialogInfoInterface, ServiceProjectInterface } from '../../interfaces/services/service/service.project.interface';
import { ElectronService } from '../electron.service';
import { StoreService } from '../store.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceProjectService extends StoreService<ServiceProjectInterface> {
  protected state: BehaviorSubject<ServiceProjectInterface> = new BehaviorSubject<ServiceProjectInterface>({
    files: [],
    selectedItem: null,
    dialogInfo: {
      dialogType: null
    }
  });

  public get getState() {
    return this.state.value;
  }

  public constructor(private readonly electronService: ElectronService, protected readonly appRef: ApplicationRef) {
    super(appRef);
  }

  public setFiles(files: ServiceProjectItemInterface[]) {
    this.updateState({ files: [...files] });
  }

  public setSelectedItem(selectedItem: ServiceProjectItemInterface) {
    this.updateState({ selectedItem: { ...selectedItem } });
  }

  public setDialogInfo(dialogInfo: ServiceProjectDialogInfoInterface) {
    this.updateState({ dialogInfo: { ...dialogInfo } });
  }

  public setSelectedProjectItem(oldPath: string, newName: string) {
    const newPath = oldPath.slice(0, oldPath.lastIndexOf(this.electronService.isWin ? '\\' : '/') + 1).concat(newName);
    const item = this.getProjectItemFromPath(newPath, this.getState.files[0]);
    if (item) {
      this.setSelectedItem(item);
    }
  }

  public getProjectItemFromPath(path: string, item: ServiceProjectItemInterface) {
    if (item.fullPath === path) {
      return item;
    }
    for (const child of item.children) {
      const childItem = this.getProjectItemFromPath(path, child);
      if (childItem) {
        return childItem;
      }
    }
    return null;
  }
}
