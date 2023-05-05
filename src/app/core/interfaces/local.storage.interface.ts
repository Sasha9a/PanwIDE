import { ServiceTypeEnum } from '../enums/service.type.enum';

export interface LocalPanelInterface {
  isShow: boolean;
  size: number;
  services: ServiceTypeEnum[];
  activeService: ServiceTypeEnum;
}

export interface LocalStorageInterface {
  leftPanel: LocalPanelInterface;
  rightPanel: LocalPanelInterface;
  bottomPanel: LocalPanelInterface;
}
