import { Injectable } from '@angular/core';
import { ServiceTypeEnum } from '../enums/service.type.enum';
import { GlobalStorageInterface } from '../interfaces/global.storage.interface';
import { ElectronService } from './electron.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalStorageService {
  private _globalStorageInfo: GlobalStorageInterface;
  private readonly fullPath: string;

  public get globalStorageInfo(): GlobalStorageInterface {
    return this._globalStorageInfo;
  }

  public constructor(private readonly electronService: ElectronService) {
    const userDataPath = this.electronService.remote.app.getPath('userData');
    if (userDataPath.includes('\\')) {
      this.fullPath = userDataPath + '\\localStorage.json';
    } else {
      this.fullPath = userDataPath + '/localStorage.json';
    }
  }

  public loadStorage() {
    if (!this.electronService.fs.existsSync(this.fullPath)) {
      this.electronService.fs.openSync(this.fullPath, 'w+');
    }
    this.electronService.fs.readFile(this.fullPath, (err, data) => {
      if (err) {
        throw err;
      }
      if (data.toString()) {
        this._globalStorageInfo = JSON.parse(data.toString());
      } else {
        this._globalStorageInfo = {
          openDirectory: null,
          leftPanel: {
            isShow: true,
            size: 25,
            services: [ServiceTypeEnum.PROJECT],
            activeService: ServiceTypeEnum.PROJECT
          },
          rightPanel: {
            isShow: false,
            size: 25,
            services: [],
            activeService: null
          },
          bottomPanel: {
            isShow: false,
            size: 20,
            services: [],
            activeService: null
          }
        };
      }
    });
  }

  public updateStorage() {
    this.electronService.fs.writeFileSync(this.fullPath, JSON.stringify(this._globalStorageInfo));
  }
}
