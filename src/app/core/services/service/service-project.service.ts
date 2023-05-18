import { ApplicationRef, Injectable } from '@angular/core';
import plist from 'plist';
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
    loading: false,
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
    if (this.getState.loading) {
      this.updateState({ loading: false });
    }
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

  public createFile(path: string) {
    this.updateState({ loading: true });
    const fd = this.electronService.fs.openSync(path, 'w+');
    this.electronService.fs.closeSync(fd);
  }

  public createDir(path: string) {
    this.updateState({ loading: true });
    this.electronService.fs.mkdirSync(path);
  }

  public deleteFile() {
    const selectedItems = this.getState.selectedItems;

    this.updateState({ loading: true });

    for (const selectedItem of selectedItems) {
      if (this.electronService.fs.existsSync(selectedItem.fullPath)) {
        this.electronService.fs.rm(selectedItem.fullPath, { recursive: true, force: true }, (err) => {
          if (err) {
            console.error(err);
          }
        });
      }
    }
    this.setSelectedItems([]);
  }

  public renameFile(newName: string) {
    const selectedItems = this.getState.selectedItems;

    this.updateState({ loading: true });

    if (selectedItems?.length) {
      const selectedItem = selectedItems[0];
      const newPath = selectedItem.fullPath
        .slice(0, selectedItem.fullPath.lastIndexOf(this.electronService.isWin ? '\\' : '/') + 1)
        .concat(newName);

      if (this.electronService.fs.existsSync(selectedItem.fullPath)) {
        this.electronService.fs.renameSync(selectedItem.fullPath, newPath);
        selectedItem.fullPath = newPath;
      }

      this.setSelectedItems(selectedItems);
    }
  }

  public pasteFile() {
    const selectedItems = this.getState.selectedItems;
    const parentItem = this.getState.filesFlat?.[0];
    const newSelectedDirectoryPath: string[] = [];
    const arrayFilesInSelectedDirectory: { path: string; items: string[] }[] = [];

    this.updateState({ loading: true });

    for (const selectedItem of selectedItems) {
      if (selectedItem.fullPath === parentItem.fullPath && !selectedItem.isDirectory) {
        continue;
      }
      if (selectedItem.isDirectory) {
        newSelectedDirectoryPath.push(selectedItem.fullPath);
        continue;
      }
      newSelectedDirectoryPath.push(
        selectedItem.fullPath.slice(0, selectedItem.fullPath.lastIndexOf(this.electronService.isWin ? '\\' : '/'))
      );
    }

    for (const selectedDirectoryPath of newSelectedDirectoryPath) {
      if (this.electronService.fs.existsSync(selectedDirectoryPath)) {
        arrayFilesInSelectedDirectory.push({
          path: selectedDirectoryPath,
          items: this.electronService.fs.readdirSync(selectedDirectoryPath)
        });
      }
    }

    if (window.process.platform === 'darwin') {
      if (this.electronService.clipboard.read('NSFilenamesPboardType') && arrayFilesInSelectedDirectory?.length) {
        const copyFilesPath: string[] = plist.parse(this.electronService.clipboard.read('NSFilenamesPboardType')) as string[];
        for (const filePath of copyFilesPath) {
          if (!this.electronService.fs.existsSync(filePath)) {
            continue;
          }
          for (const itemDirectory of arrayFilesInSelectedDirectory) {
            const nameFile = filePath.slice(filePath.lastIndexOf(this.electronService.isWin ? '\\' : '/') + 1);
            if (itemDirectory.items.some((item) => item === nameFile)) {
              continue;
            }
            this.electronService.fs.cp(
              filePath,
              itemDirectory.path + (this.electronService.isWin ? '\\' : '/') + nameFile,
              {
                recursive: true
              },
              (err) => {
                if (err) {
                  console.error(err);
                }
              }
            );
          }
        }
      }
    }
  }

  public moveFile(item: ServiceProjectItemInterface) {
    const selectedItems = this.getState.selectedItems;

    this.updateState({ loading: true });

    for (const selectedItem of selectedItems) {
      const newPath = item.fullPath.concat(this.electronService.isWin ? '\\' : '/').concat(selectedItem.name);
      if (this.electronService.fs.existsSync(selectedItem.fullPath)) {
        this.electronService.fs.rename(selectedItem.fullPath, newPath, (err) => {
          if (err) {
            console.error(err);
          }
        });
        selectedItem.fullPath = newPath;
      }
    }
    this.setSelectedItems(selectedItems);
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
