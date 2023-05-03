import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PanelEnum } from '../enums/panel.enum';
import { ServiceTypeEnum } from '../enums/service.type.enum';
import { GlobalPanelInterface, GlobalStorageInterface } from '../interfaces/global.storage.interface';
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

  public changeService(newPanel: PanelEnum, serviceType: ServiceTypeEnum, index: number) {
    const oldPanel = this.getPanelFromService(serviceType);
    let isActiveService = false;

    if (newPanel === oldPanel) {
      return;
    }

    if (oldPanel) {
      const oldKey = this.convertPanelTypeToKey(oldPanel);
      const oldData: GlobalPanelInterface = this.getState[oldKey];
      oldData.services = oldData.services.filter((serv) => serv !== serviceType);
      if (oldData.activeService === serviceType) {
        oldData.activeService = null;
        isActiveService = true;
      }
      this.updateState({
        [oldKey]: { ...oldData }
      });
    }

    const newKey = this.convertPanelTypeToKey(newPanel);
    const newData: GlobalPanelInterface = this.getState[newKey];
    newData.services.splice(index, 0, serviceType);
    if (isActiveService) {
      newData.activeService = serviceType;
    }
    this.updateState({
      [newKey]: { ...newData }
    });
  }

  public getPanelFromService(serviceType: ServiceTypeEnum) {
    if (this.getState.leftPanel?.services?.includes(serviceType)) {
      return PanelEnum.LEFT;
    }
    if (this.getState.bottomPanel?.services?.includes(serviceType)) {
      return PanelEnum.BOTTOM;
    }
    if (this.getState.rightPanel?.services?.includes(serviceType)) {
      return PanelEnum.RIGHT;
    }
    return null;
  }

  public convertPanelTypeToKey(panelType: PanelEnum) {
    let key: keyof GlobalStorageInterface;
    switch (panelType) {
      case PanelEnum.LEFT: {
        key = 'leftPanel';
        break;
      }
      case PanelEnum.BOTTOM: {
        key = 'bottomPanel';
        break;
      }
      case PanelEnum.RIGHT: {
        key = 'rightPanel';
        break;
      }
    }
    return key;
  }
}
