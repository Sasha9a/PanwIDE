import { ApplicationRef, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PanelEnum } from '../enums/panel.enum';
import { ServiceTypeEnum } from '../enums/service.type.enum';
import { LocalPanelInterface, LocalStorageInterface } from '../interfaces/local.storage.interface';
import { localStorageInitialState } from '../state/local.storage.initial.state';
import { KeysOfType } from '../types/keys-of.type';
import { ElectronService } from './electron.service';
import { LocalTmpStorageService } from './local-tmp-storage.service';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService extends StoreService<LocalStorageInterface> {
  protected state = new BehaviorSubject(localStorageInitialState);
  private fullPath: string;

  public get getState() {
    return this.state.value;
  }

  public constructor(
    private readonly electronService: ElectronService,
    private readonly localTmpStorageService: LocalTmpStorageService,
    protected readonly appRef: ApplicationRef
  ) {
    super(appRef);
  }

  public loadLocalStorage(projectPath: string) {
    const isWin = this.electronService.isWin;
    const pathIde = isWin ? projectPath + '\\.ide' : projectPath + '/.ide';
    this.fullPath = isWin ? pathIde + '\\localStorage.json' : pathIde + '/localStorage.json';
    if (!this.electronService.fs.existsSync(pathIde)) {
      this.electronService.fs.mkdirSync(pathIde);
    }
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
    if (this.electronService.fs.existsSync(this.fullPath)) {
      this.electronService.fs.writeFileSync(this.fullPath, JSON.stringify(this.getState));
    }
  }

  public resizePanel(sizes: [number, number], panel: PanelEnum) {
    if (panel === PanelEnum.LEFT) {
      const panelInfo = this.getState.leftPanel;

      if (panelInfo.size === sizes[0]) {
        return;
      }

      panelInfo.size = sizes[0];
      this.updateState({
        leftPanel: { ...panelInfo }
      });
      this.updateStorage();
    } else {
      const panelKey = this.convertPanelTypeToKey(panel);
      const panelInfo = this.getState[panelKey];

      if (panelInfo.size === sizes[1]) {
        return;
      }

      panelInfo.size = sizes[1];
      this.updateState({
        [panelKey]: { ...panelInfo }
      });
      this.updateStorage();
    }
  }

  public toggleService(serviceType: ServiceTypeEnum) {
    const panel = this.getPanelFromService(serviceType);
    const panelKey = this.convertPanelTypeToKey(panel);
    const panelInfo = this.getState[panelKey];

    if (panelInfo?.activeService === serviceType) {
      panelInfo.activeService = null;
      panelInfo.isShow = false;
      this.localTmpStorageService.setActivePanel(PanelEnum.CENTER);
    } else {
      panelInfo.activeService = serviceType;
      panelInfo.isShow = true;
      this.localTmpStorageService.setActivePanel(panel);
    }
    this.updateState({
      [panelKey]: { ...panelInfo }
    });
    this.updateStorage();
  }

  public changeService(newPanel: PanelEnum, serviceType: ServiceTypeEnum, index: number) {
    const oldPanel = this.getPanelFromService(serviceType);
    let isActiveService = false;

    if (newPanel === oldPanel) {
      return;
    }

    if (oldPanel) {
      const oldKey = this.convertPanelTypeToKey(oldPanel);
      const oldData: LocalPanelInterface = this.getState[oldKey];
      oldData.services = oldData.services.filter((serv) => serv !== serviceType);
      if (oldData.activeService === serviceType) {
        oldData.activeService = null;
        oldData.isShow = false;
        isActiveService = true;
      }
      this.updateState({
        [oldKey]: { ...oldData }
      });
    }

    const newKey = this.convertPanelTypeToKey(newPanel);
    const newData: LocalPanelInterface = this.getState[newKey];
    newData.services.splice(index, 0, serviceType);
    if (isActiveService) {
      newData.activeService = serviceType;
      newData.isShow = true;
      if (this.localTmpStorageService.getState.activePanel === oldPanel) {
        this.localTmpStorageService.setActivePanel(newPanel);
      }
    }
    this.updateState({
      [newKey]: { ...newData }
    });
    this.updateStorage();
  }

  public setOpenedDirectory(openedDirectories: string[]) {
    this.updateState({ openedDirectories: [...openedDirectories] });
    this.updateStorage();
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

  public convertPanelTypeToKey(panelType: PanelEnum): KeysOfType<LocalStorageInterface, LocalPanelInterface> {
    let key: KeysOfType<LocalStorageInterface, LocalPanelInterface>;
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
