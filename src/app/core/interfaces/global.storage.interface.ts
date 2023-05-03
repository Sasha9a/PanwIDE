import { ServiceTypeEnum } from '../enums/service.type.enum';

export interface GlobalPanelInterface {
  isShow: boolean;
  size: number;
  services: ServiceTypeEnum[];
  activeService: ServiceTypeEnum;
}

export interface GlobalStorageInterface {
  openDirectory: string;
  leftPanel: GlobalPanelInterface;
  rightPanel: GlobalPanelInterface;
  bottomPanel: GlobalPanelInterface;
}
