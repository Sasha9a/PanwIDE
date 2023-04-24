import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ElectronService } from '../../../../core/services/electron.service';
import { GlobalStorageService } from '../../../../core/services/global.storage.service';
import { ServiceProjectItemInterface } from '../../interfaces/service.project.item.interface';

@Component({
  standalone: true,
  selector: 'app-service-project',
  templateUrl: './service-project.component.html',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceProjectComponent implements OnInit {
  public openDirectory$: Observable<string>;
  public files: Record<string, ServiceProjectItemInterface> = {};

  public constructor(public readonly globalStorageService: GlobalStorageService, private readonly electronService: ElectronService) {}

  public ngOnInit() {
    this.openDirectory$ = this.globalStorageService.select((state) => state.openDirectory);
    this.openDirectory$.subscribe((path) => {
      if (path) {
        this.parseFiles(path, this.files);
      }
    });
  }

  private parseFiles(path: string, info: Record<string, ServiceProjectItemInterface>) {
    this.electronService.fs.stat(path, (err, stats) => {
      if (!err) {
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
          if (!err) {
            console.error(err);
            return;
          }

          items.forEach((item) => {
            const pathFile = this.globalStorageService.isWin ? path + '\\' + item : path + '/' + item;
            this.electronService.fs.stat(pathFile, (err, fileStats) => {
              if (!err) {
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
}
