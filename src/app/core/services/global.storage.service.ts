import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GlobalStorageInterface } from '../interfaces/global.storage.interface';
import { globalStorageInitialState } from '../state/global.storage.initial.state';
import { ElectronService } from './electron.service';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalStorageService extends StoreService<GlobalStorageInterface> {
  protected state = new BehaviorSubject(globalStorageInitialState);
  private readonly fullPath: string;
  public isWin: boolean;

  public get getState() {
    return this.state.value;
  }

  public constructor(private readonly electronService: ElectronService) {
    super();
    const userDataPath = this.electronService.remote.app.getPath('userData');
    if (userDataPath.includes('\\')) {
      this.fullPath = userDataPath + '\\localStorage.json';
      this.isWin = true;
    } else {
      this.fullPath = userDataPath + '/localStorage.json';
      this.isWin = false;
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
        this.updateState(JSON.parse(data.toString()));
      }
    });
  }

  public updateStorage() {
    this.electronService.fs.writeFileSync(this.fullPath, JSON.stringify(this.getState));
  }
}
