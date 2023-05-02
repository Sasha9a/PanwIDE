import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { Observable } from 'rxjs';
import { IpcChannelEnum } from '../../../../../../libs/enums/ipc.channel.enum';
import { ServiceProjectItemInterface } from '../../../../../../libs/interfaces/service.project.item.interface';
import { ElectronService } from '../../../../core/services/electron.service';
import { GlobalStorageService } from '../../../../core/services/global.storage.service';
import { FileTypeImagePathPipe } from '../../../../shared/pipes/file-type-image-path.pipe';
import { OrderByPipe } from '../../../../shared/pipes/order-by.pipe';

@Component({
  standalone: true,
  selector: 'app-service-project',
  templateUrl: './service-project.component.html',
  imports: [CommonModule, ScrollPanelModule, NgOptimizedImage, FileTypeImagePathPipe, OrderByPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceProjectComponent implements OnInit {
  public openDirectory$: Observable<string>;
  public files: ServiceProjectItemInterface[];
  public openedDirectory: string[] = [];
  public selectedItem: ServiceProjectItemInterface;

  public constructor(
    public readonly globalStorageService: GlobalStorageService,
    private readonly electronService: ElectronService,
    private readonly cdRef: ChangeDetectorRef
  ) {}

  public ngOnInit() {
    this.openDirectory$ = this.globalStorageService.select((state) => state.openDirectory);
    this.openDirectory$.subscribe((path) => {
      if (path) {
        this.electronService.ipcRenderer.invoke(IpcChannelEnum.SERVICE_PROJECT_START_LOAD_FILES, path).catch(console.error);
      }
    });

    this.electronService.ipcRenderer.on(IpcChannelEnum.SERVICE_PROJECT_GET_FILES, (event, files) => {
      this.files = files;
      this.cdRef.detectChanges();
    });
  }

  public toItem(item: any): ServiceProjectItemInterface {
    return item as ServiceProjectItemInterface;
  }

  public toggleOpenedDirectory(fullPath: string) {
    if (this.openedDirectory.includes(fullPath)) {
      this.openedDirectory = this.openedDirectory.filter((path) => path !== fullPath);
    } else {
      this.openedDirectory.push(fullPath);
    }
    this.cdRef.detectChanges();
  }

  public setSelectedItem(item: ServiceProjectItemInterface) {
    this.selectedItem = item;
    this.cdRef.detectChanges();
  }
}
