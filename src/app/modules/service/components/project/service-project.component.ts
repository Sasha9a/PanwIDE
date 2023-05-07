import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { Observable } from 'rxjs';
import { IpcChannelEnum } from '../../../../../../libs/enums/ipc.channel.enum';
import { ServiceProjectItemInterface } from '../../../../../../libs/interfaces/service.project.item.interface';
import { ExternalEventsDirective } from '../../../../core/directives/external-events.directive';
import { InfiniteAutofocusDirective } from '../../../../core/directives/infinite-autofocus.directive';
import { ElectronService } from '../../../../core/services/electron.service';
import { GlobalStorageService } from '../../../../core/services/global.storage.service';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { ServiceProjectService } from '../../../../core/services/service/service-project.service';
import { FileTypeImagePathPipe } from '../../../../shared/pipes/file-type-image-path.pipe';
import { OrderByPipe } from '../../../../shared/pipes/order-by.pipe';
import { ParseFormErrorToStringPipe } from '../../../../shared/pipes/parse-form-error-to-string.pipe';
import { ServiceProjectDialogTypeEnum } from '../../enums/service.project.dialog.type.enum';
import { ServiceProjectNewFileNameValidator } from '../../validators/service.project.new.file.name.validator';

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
    ParseFormErrorToStringPipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceProjectComponent implements OnInit {
  @ViewChild('contextMenu') public contextMenu: ContextMenu;

  public openDirectory$: Observable<string>;
  public files$: Observable<ServiceProjectItemInterface[]>;
  public openedDirectories$: Observable<string[]>;
  public selectedItem$: Observable<ServiceProjectItemInterface>;

  public isShowDialog = false;
  public textHeaderDialog: string;
  public checkedClicked = false;

  public formDialog: FormGroup<{ name: FormControl<string> }>;
  public directoryErrorsForm: Record<string, string> = {
    minlength: 'Введите название',
    existsFile: 'Файл с этим названием уже существует',
    existsDirectory: 'Папка с этим названием уже существует'
  };

  public contextMenuItems: MenuItem[];

  public constructor(
    private readonly globalStorageService: GlobalStorageService,
    private readonly localStorageService: LocalStorageService,
    private readonly electronService: ElectronService,
    private readonly serviceProjectService: ServiceProjectService,
    private readonly serviceProjectNewFileNameValidator: ServiceProjectNewFileNameValidator
  ) {}

  public ngOnInit() {
    this.formDialog = new FormGroup<{ name: FormControl<string> }>({
      name: new FormControl('', [Validators.minLength(1), this.serviceProjectNewFileNameValidator.bind()])
    });

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
      }
    ];

    this.openDirectory$ = this.globalStorageService.select((state) => state.openDirectory);
    this.openDirectory$.subscribe((path) => {
      if (path) {
        this.electronService.ipcRenderer.invoke(IpcChannelEnum.SERVICE_PROJECT_START_LOAD_FILES, path).catch(console.error);
      }
    });

    this.openedDirectories$ = this.localStorageService.select((state) => state.openedDirectories);
    this.files$ = this.serviceProjectService.select((state) => state.files);
    this.selectedItem$ = this.serviceProjectService.select((state) => state.selectedItem);

    this.electronService.ipcRenderer.on(IpcChannelEnum.SERVICE_PROJECT_GET_FILES, (event, files) => {
      this.serviceProjectService.setFiles(files);
    });
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
  }

  public setSelectedItem(item: ServiceProjectItemInterface) {
    this.serviceProjectService.setSelectedItem(item);
  }

  public toggleContextMenu(event: MouseEvent, item: ServiceProjectItemInterface) {
    this.serviceProjectService.setSelectedItem(item);
    this.contextMenu.show(event);
  }

  public clickToEscape() {
    if (this.isShowDialog) {
      this.isShowDialog = false;
    }
  }

  public onClickEnterDialog() {
    console.log(this.formDialog);
    if (this.formDialog.valid) {
    }
  }

  private hideDialog() {
    if (this.isShowDialog && !this.checkedClicked) {
      this.isShowDialog = false;
    }
  }
}
