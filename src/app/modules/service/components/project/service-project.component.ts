import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { DragDropModule } from 'primeng/dragdrop';
import { InputTextModule } from 'primeng/inputtext';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { Tooltip } from 'primeng/tooltip';
import { Observable } from 'rxjs';
import { Key } from 'ts-key-enum';
import { IpcChannelEnum } from '../../../../../../libs/enums/ipc.channel.enum';
import { ServiceProjectItemInterface } from '../../../../../../libs/interfaces/service.project.item.interface';
import { ExternalEventsDirective } from '../../../../core/directives/external-events.directive';
import { InfiniteAutofocusDirective } from '../../../../core/directives/infinite-autofocus.directive';
import { PanelEnum } from '../../../../core/enums/panel.enum';
import { ServiceTypeEnum } from '../../../../core/enums/service.type.enum';
import { ServiceProjectDialogInfoInterface } from '../../../../core/interfaces/services/service/service.project.interface';
import { ElectronService } from '../../../../core/services/electron.service';
import { GlobalStorageService } from '../../../../core/services/global.storage.service';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { LocalTmpStorageService } from '../../../../core/services/local-tmp-storage.service';
import { ServiceProjectService } from '../../../../core/services/service/service-project.service';
import { FileTypeImagePathPipe } from '../../../../shared/pipes/file-type-image-path.pipe';
import { IsDroppableProjectFilePipe } from '../../../../shared/pipes/is-droppable-project-file.pipe';
import { IsSelectProjectItemPipe } from '../../../../shared/pipes/is-select-project-item.pipe';
import { OrderByPipe } from '../../../../shared/pipes/order-by.pipe';
import { ParseFormErrorToStringPipe } from '../../../../shared/pipes/parse-form-error-to-string.pipe';
import { ServiceProjectDialogTypeEnum } from '../../enums/service.project.dialog.type.enum';
import { ServiceProjectNewNameValidator } from '../../validators/service.project.new.name.validator';
import { ServiceProjectRenameFileValidator } from '../../validators/service.project.rename.file.validator';

@Component({
  standalone: true,
  selector: 'app-service-project',
  templateUrl: './service-project.component.html',
  imports: [
    CommonModule,
    ScrollPanelModule,
    NgOptimizedImage,
    FileTypeImagePathPipe,
    OrderByPipe,
    ContextMenuModule,
    DialogModule,
    InputTextModule,
    InfiniteAutofocusDirective,
    ExternalEventsDirective,
    ReactiveFormsModule,
    ParseFormErrorToStringPipe,
    ButtonModule,
    IsSelectProjectItemPipe,
    DragDropModule,
    IsDroppableProjectFilePipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceProjectComponent implements OnInit {
  @ViewChild('contextMenu') public contextMenu: ContextMenu;
  @ViewChild('inputRenameFile') public inputRenameFile: ElementRef;
  @ViewChild(Tooltip) tooltip: Tooltip;

  public panel: PanelEnum;

  public openDirectory$: Observable<string>;
  public files$: Observable<ServiceProjectItemInterface[]>;
  public openedDirectories$: Observable<string[]>;
  public selectedItems$: Observable<ServiceProjectItemInterface[]>;
  public activePanel$: Observable<PanelEnum>;
  public dialogInfo$: Observable<ServiceProjectDialogInfoInterface>;

  public isShowDialog = false;
  public textHeaderDialog: string;
  public checkedClicked = false;

  public formDialog: FormGroup<{ name: FormControl<string>; nameRename: FormControl<string> }>;
  public directoryErrorsForm: Record<string, string> = {
    exists: 'Это название уже занято'
  };

  public contextMenuItems: MenuItem[] = [];

  public isDragFile = false;

  public pressed = new Set<string>();

  public get ServiceProjectDialogTypeEnum() {
    return ServiceProjectDialogTypeEnum;
  }

  public constructor(
    private readonly globalStorageService: GlobalStorageService,
    private readonly localStorageService: LocalStorageService,
    private readonly localTmpStorageService: LocalTmpStorageService,
    private readonly electronService: ElectronService,
    private readonly serviceProjectService: ServiceProjectService,
    private readonly serviceProjectNewFileNameValidator: ServiceProjectNewNameValidator,
    private readonly serviceProjectRenameFileValidator: ServiceProjectRenameFileValidator,
    private readonly cdRef: ChangeDetectorRef
  ) {}

  public ngOnInit() {
    this.formDialog = new FormGroup<{ name: FormControl<string>; nameRename: FormControl<string> }>({
      name: new FormControl<string>('', [this.serviceProjectNewFileNameValidator.bind()]),
      nameRename: new FormControl<string>('', [this.serviceProjectRenameFileValidator.bind()])
    });

    this.panel = this.localStorageService.getPanelFromService(ServiceTypeEnum.PROJECT);
    this.localTmpStorageService
      .select((state) => state.dragInfo)
      .subscribe(() => {
        this.panel = this.localStorageService.getPanelFromService(ServiceTypeEnum.PROJECT);
      });

    this.openDirectory$ = this.globalStorageService.select((state) => state.openDirectory);
    this.openDirectory$.subscribe((path) => {
      if (path) {
        this.electronService.ipcRenderer.invoke(IpcChannelEnum.SERVICE_PROJECT_START_LOAD_FILES, path).catch(console.error);
      }
    });

    this.openedDirectories$ = this.localStorageService.select((state) => state.openedDirectories);
    this.files$ = this.serviceProjectService.select((state) => state.files);
    this.selectedItems$ = this.serviceProjectService.select((state) => state.selectedItems);
    this.activePanel$ = this.localTmpStorageService.select((state) => state.activePanel);
    this.dialogInfo$ = this.serviceProjectService.select((state) => state.dialogInfo);

    this.electronService.ipcRenderer.on(IpcChannelEnum.SERVICE_PROJECT_GET_FILES, (event, files) => {
      this.serviceProjectService.setFiles(files);
    });

    this.setContextMenuItems();
  }

  @HostListener('window:keydown', ['$event'])
  public onKeydown(event: KeyboardEvent) {
    this.pressed.add(event.key);
  }

  @HostListener('window:keyup', ['$event'])
  public onKeyup(event: KeyboardEvent) {
    if (this.panel === this.localTmpStorageService.getState?.activePanel) {
      if (event.key === Key.Delete) {
        this.deleteFile();
      }
      if (this.pressed.has(Key.Shift) && this.pressed.has(Key.F6)) {
        this.showRenameDialog();
      }
    }
    this.pressed.delete(event.key);
  }

  public onClickExternalDialog() {
    this.hideDialog();
  }

  public onContextMenuExternalDialog() {
    this.hideDialog();
  }

  public toItem(item: any): ServiceProjectItemInterface {
    return item as ServiceProjectItemInterface;
  }

  public toggleOpenedDirectory(fullPath: string) {
    let openedDirectory = this.localStorageService.getState.openedDirectories;
    if (openedDirectory.includes(fullPath)) {
      openedDirectory = openedDirectory.filter((path) => path !== fullPath);
    } else {
      openedDirectory.push(fullPath);
    }
    this.contextMenu.hide();
    this.localStorageService.setOpenedDirectory(openedDirectory);
    this.serviceProjectService.updateFilesFlat();
  }

  public setSelectedItem(item: ServiceProjectItemInterface) {
    const selectedItems = this.serviceProjectService.getState.selectedItems;
    if (this.pressed.has(Key.Shift)) {
      const filesFlat = this.serviceProjectService.getState.filesFlat;
      const itemIndex = filesFlat?.findIndex((ff) => item.fullPath === ff.fullPath);

      if (!selectedItems?.length) {
        this.serviceProjectService.setSelectedItems([item]);
      } else {
        const selectedItemIndex = filesFlat?.findIndex((ff) => selectedItems[selectedItems.length - 1].fullPath === ff.fullPath);
        let minIndex: number;
        let maxIndex: number;

        if (selectedItemIndex > itemIndex) {
          minIndex = itemIndex;
          maxIndex = selectedItemIndex;
        } else {
          minIndex = selectedItemIndex;
          maxIndex = itemIndex;
        }

        const newSelectedItems: ServiceProjectItemInterface[] = [];
        filesFlat.forEach((fileFlat, index) => {
          if (index >= minIndex && index <= maxIndex) {
            newSelectedItems.push(fileFlat);
          }
        });
        this.serviceProjectService.setSelectedItems([...newSelectedItems]);
      }
    } else if (this.pressed.has(this.electronService.isWin ? Key.Control : Key.Meta)) {
      this.serviceProjectService.setSelectedItems([...selectedItems, item]);
    } else {
      this.serviceProjectService.setSelectedItems([item]);
    }
  }

  public toggleContextMenu(event: MouseEvent, item: ServiceProjectItemInterface) {
    const selectedItems = this.serviceProjectService.getState.selectedItems;
    if (!selectedItems.some((selectedItem) => selectedItem.fullPath === item.fullPath)) {
      this.serviceProjectService.setSelectedItems([item]);
    }
    this.setContextMenuItems();
    this.contextMenu.show(event);
  }

  public clickToEscape() {
    if (this.isShowDialog) {
      this.isShowDialog = false;
      this.formDialog.reset();
    }
  }

  public onClickEnterDialog() {
    if (this.formDialog.valid) {
      const selectedItems = this.serviceProjectService.getState.selectedItems;
      const isWin = this.electronService.isWin;
      const dialogType = this.serviceProjectService.getState.dialogInfo?.dialogType;
      for (const selectedItem of selectedItems) {
        const pathParent = selectedItem.isDirectory
          ? selectedItem.fullPath
          : selectedItem.fullPath.substring(0, selectedItem.fullPath.lastIndexOf(isWin ? '\\' : '/'));
        const fullPath = pathParent + (isWin ? `\\${this.formDialog.get('name').value}` : `/${this.formDialog.get('name').value}`);

        if (dialogType === ServiceProjectDialogTypeEnum.newDirectory) {
          this.electronService.fs.mkdirSync(fullPath);
        } else if (dialogType === ServiceProjectDialogTypeEnum.newFile) {
          const fd = this.electronService.fs.openSync(fullPath, 'w+');
          this.electronService.fs.closeSync(fd);
        } else if (dialogType === ServiceProjectDialogTypeEnum.newPwn) {
          const fd = this.electronService.fs.openSync(`${fullPath}.pwn`, 'w+');
          this.electronService.fs.closeSync(fd);
        } else if (dialogType === ServiceProjectDialogTypeEnum.newInc) {
          const fd = this.electronService.fs.openSync(`${fullPath}.inc`, 'w+');
          this.electronService.fs.closeSync(fd);
        } else if (dialogType === ServiceProjectDialogTypeEnum.rename) {
          this.renameFile();
        }
      }

      this.isShowDialog = false;
      this.formDialog.reset();
    }
  }

  public onDragEndDialog() {
    if (this.tooltip) {
      this.tooltip.activate();
    }
  }

  public hideDialog() {
    if (this.isShowDialog && !this.checkedClicked) {
      this.isShowDialog = false;
      this.formDialog.reset();
    }
  }

  public deleteFile() {
    const selectedItems = this.serviceProjectService.getState.selectedItems;
    for (const selectedItem of selectedItems) {
      if (this.electronService.fs.existsSync(selectedItem.fullPath)) {
        this.electronService.fs.rmSync(selectedItem.fullPath, { recursive: true, force: true });
      }
    }
    this.serviceProjectService.setSelectedItems([]);
  }

  public renameFile() {
    const selectedItems = this.serviceProjectService.getState.selectedItems;
    const name = this.formDialog.get('nameRename').value;
    if (selectedItems?.length) {
      const selectedItem = selectedItems[0];
      const newPath = selectedItem.fullPath
        .slice(0, selectedItem.fullPath.lastIndexOf(this.electronService.isWin ? '\\' : '/') + 1)
        .concat(name);

      if (this.electronService.fs.existsSync(selectedItem.fullPath)) {
        this.electronService.fs.renameSync(selectedItem.fullPath, newPath);
      }

      selectedItem.fullPath = newPath;
      this.serviceProjectService.setSelectedItems(selectedItems);
    }
    this.isShowDialog = false;
    this.formDialog.reset();
  }

  public onStartDragFile() {
    this.isDragFile = true;
    this.cdRef.detectChanges();
  }

  public onDragEndFile() {
    this.isDragFile = false;
    this.cdRef.detectChanges();
  }

  private setContextMenuItems() {
    this.contextMenuItems = [
      {
        label: 'Добавить',
        icon: 'pi pi-plus',
        items: [
          {
            label: `<div class="flex align-items-center gap-2">
                    <img src="assets/icons/file-type/file.png" width="16" alt="file" />
                    Файл
                  </div>`,
            escape: false,
            command: () => {
              this.isShowDialog = true;
              this.serviceProjectService.setDialogInfo({ dialogType: ServiceProjectDialogTypeEnum.newFile });
              this.textHeaderDialog = 'Новый файл';
              this.checkedClicked = true;
              setTimeout(() => {
                this.checkedClicked = false;
              }, 500);
            }
          },
          {
            label: `<div class="flex align-items-center gap-2">
                    <img src="assets/icons/file-type/directory.png" width="16" alt="directory" />
                    Папку
                  </div>`,
            escape: false,
            command: () => {
              this.isShowDialog = true;
              this.serviceProjectService.setDialogInfo({ dialogType: ServiceProjectDialogTypeEnum.newDirectory });
              this.textHeaderDialog = 'Новая папка';
              this.checkedClicked = true;
              setTimeout(() => {
                this.checkedClicked = false;
              }, 500);
            }
          },
          {
            separator: true
          },
          {
            label: `<div class="flex align-items-center gap-2">
                    <img src="assets/icons/file-type/pwn.png" width="16" alt="pwn" />
                    pwn файл
                  </div>`,
            escape: false,
            command: () => {
              this.isShowDialog = true;
              this.serviceProjectService.setDialogInfo({ dialogType: ServiceProjectDialogTypeEnum.newPwn });
              this.textHeaderDialog = 'Новый pwn файл';
              this.checkedClicked = true;
              setTimeout(() => {
                this.checkedClicked = false;
              }, 500);
            }
          },
          {
            label: `<div class="flex align-items-center gap-2">
                    <img src="assets/icons/file-type/inc.png" width="16" alt="inc" />
                    inc файл
                  </div>`,
            escape: false,
            command: () => {
              this.isShowDialog = true;
              this.serviceProjectService.setDialogInfo({ dialogType: ServiceProjectDialogTypeEnum.newInc });
              this.textHeaderDialog = 'Новый inc файл';
              this.checkedClicked = true;
              setTimeout(() => {
                this.checkedClicked = false;
              }, 500);
            }
          }
        ]
      },
      {
        separator: true
      },
      {
        label: `<div class="flex justify-content-between gap-2">
                  <div class="flex align-items-center gap-2">
                    <div class="w-1rem"></div>
                    Переименовать
                  </div>
                  <p class="font-normal text-gray-300 white-space-nowrap">
                    ${this.electronService.isWin ? 'Shift+F6' : '⇧F6'}
                  </p>
                </div>`,
        escape: false,
        visible: this.serviceProjectService.getState.selectedItems?.length === 1,
        command: () => {
          this.showRenameDialog();
        }
      },
      {
        separator: true,
        visible: this.serviceProjectService.getState.selectedItems?.length === 1
      },
      {
        label: `<div class="flex justify-content-between gap-2">
                  <div class="flex align-items-center gap-2">
                    <div class="w-1rem"></div>
                    Удалить
                  </div>
                  <p class="font-normal text-gray-300 white-space-nowrap">
                  ${this.electronService.isWin ? 'Delete' : '⌦'}
                  </p>
                </div>`,
        escape: false,
        command: () => {
          this.deleteFile();
        }
      }
    ];
  }

  private showRenameDialog() {
    const selectedItems = this.serviceProjectService.getState?.selectedItems;
    if (selectedItems?.length === 1) {
      const selectedItem = selectedItems[0];
      this.isShowDialog = true;
      this.serviceProjectService.setDialogInfo({ dialogType: ServiceProjectDialogTypeEnum.rename });
      this.textHeaderDialog = 'Переименование';
      this.checkedClicked = true;
      this.formDialog.get('nameRename').setValue(selectedItem.name);
      (this.inputRenameFile?.nativeElement as HTMLInputElement)?.setSelectionRange(
        0,
        selectedItem.name.lastIndexOf('.') === -1 ? selectedItem.name.length : selectedItem.name.lastIndexOf('.')
      );
      setTimeout(() => {
        this.checkedClicked = false;
      }, 500);
    }
  }
}
