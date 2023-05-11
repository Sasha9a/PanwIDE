import { ApplicationRef, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ServiceProjectItemInterface } from '../../../../../libs/interfaces/service.project.item.interface';
import { OrderByPipe } from '../../../shared/pipes/order-by.pipe';
import { ServiceProjectDialogInfoInterface, ServiceProjectInterface } from '../../interfaces/services/service/service.project.interface';
import { ElectronService } from '../electron.service';
import { LocalStorageService } from '../local-storage.service';
import { StoreService } from '../store.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceProjectService extends StoreService<ServiceProjectInterface> {
  protected state: BehaviorSubject<ServiceProjectInterface> = new BehaviorSubject<ServiceProjectInterface>({
    files: [],
    filesFlat: [],
    selectedItems: [],
    dialogInfo: {
      dialogType: null
    }
  });

  public get getState() {
    return this.state.value;
  }

  public constructor(
    private readonly electronService: ElectronService,
    private readonly localStorageService: LocalStorageService,
    private readonly orderByPipe: OrderByPipe,
    protected readonly appRef: ApplicationRef
  ) {
    super(appRef);
  }

  public setFiles(files: ServiceProjectItemInterface[]) {
    this.updateState({ files: [...files] });
    this.updateFilesFlat();
    this.checkSelectedItems();
  }

  public setSelectedItems(selectedItems: ServiceProjectItemInterface[]) {
    const newSelectedItems: ServiceProjectItemInterface[] = [];
    for (const selectedItem of selectedItems) {
      if (!newSelectedItems.some((newSelectedItem) => newSelectedItem.fullPath === selectedItem.fullPath)) {
        newSelectedItems.push(selectedItem);
      }
    }
    this.updateState({ selectedItems: [...newSelectedItems] });
  }

  public setDialogInfo(dialogInfo: ServiceProjectDialogInfoInterface) {
    this.updateState({ dialogInfo: { ...dialogInfo } });
  }

  public checkSelectedItems() {
    const selectedItems = this.getState.selectedItems;
    const filesFlat = this.getState.filesFlat;
    const newSelectedItems: ServiceProjectItemInterface[] = [];
    for (const selectedItem of selectedItems) {
      if (filesFlat.findIndex((ff) => ff.fullPath === selectedItem.fullPath) !== -1) {
        newSelectedItems.push(selectedItem);
      }
    }
    this.updateState({ selectedItems: [...newSelectedItems] });
  }

  public updateFilesFlat() {
    const filesFlat: ServiceProjectItemInterface[] = [];
    const files = this.orderByPipe.transform(this.orderByPipe.transform(this.getState.files, 'name:string'), '-isDirectory:number');
    const openedDirectories = this.localStorageService.getState.openedDirectories;

    const parseFile = (file: ServiceProjectItemInterface) => {
      const item: ServiceProjectItemInterface = { ...file };
      item.children = [];
      filesFlat.push(item);
      if (file.isDirectory && openedDirectories.includes(file.fullPath)) {
        for (const childFile of this.orderByPipe.transform(
          this.orderByPipe.transform(file.children, 'name:string'),
          '-isDirectory:number'
        )) {
          parseFile(childFile);
        }
      }
    };

    for (const file of files) {
      parseFile(file);
    }
    this.updateState({ filesFlat: [...filesFlat] });
  }
}
