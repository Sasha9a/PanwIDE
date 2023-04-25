import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { log } from 'util';
import { IpcChannelEnum } from '../../../../core/enums/ipc.channel.enum';
import { ElectronService } from '../../../../core/services/electron.service';
import { GlobalStorageService } from '../../../../core/services/global.storage.service';
import { ObjectKeysPipe } from '../../../../shared/pipes/object-keys.pipe';
import { ServiceProjectItemInterface } from '../../interfaces/service.project.item.interface';

@Component({
  standalone: true,
  selector: 'app-service-project',
  templateUrl: './service-project.component.html',
  imports: [CommonModule, ObjectKeysPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceProjectComponent implements OnInit {
  public openDirectory$: Observable<string>;
  public files: Record<string, ServiceProjectItemInterface> = {};

  public constructor(
    public readonly globalStorageService: GlobalStorageService,
    private readonly electronService: ElectronService,
    private readonly cdRef: ChangeDetectorRef
  ) {}

  public ngOnInit() {
    this.openDirectory$ = this.globalStorageService.select((state) => state.openDirectory);
    this.openDirectory$.subscribe((path) => {
      if (path) {
        this.parseFiles(path, this.files);
      }
    });

    this.electronService.ipcRenderer.invoke(IpcChannelEnum.SERVICE_PROJECT_GET_FILES, [1, 2, 3]).then((r) => console.log(r));
  }

  private parseFiles(path: string, info: Record<string, ServiceProjectItemInterface>) {
    this.electronService.fs.stat(path, (err, stats) => {
      if (err) {
        console.error(err);
        return;
      }

      const dirName = path.slice(path.lastIndexOf(this.globalStorageService.isWin ? '\\' : '/') + 1);
      info[dirName] = {
        fullPath: path,
        children: {},
        isDirectory: stats.isDirectory()
      };

      if (stats.isDirectory()) {
        this.electronService.fs.readdir(path, (err, items) => {
          if (err) {
            console.error(err);
            return;
          }

          items.forEach((item) => {
            const pathFile = this.globalStorageService.isWin ? path + '\\' + item : path + '/' + item;
            this.electronService.fs.stat(pathFile, (err, fileStats) => {
              if (err) {
                console.error(err);
                return;
              }

              this.parseFiles(pathFile, info[dirName].children);
            });
          });
        });
      }
    });
  }

  public toItem(item: any): ServiceProjectItemInterface {
    return item as ServiceProjectItemInterface;
  }
}
