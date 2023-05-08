import { PanelEnum } from '../enums/panel.enum';
import { ServiceTypeEnum } from '../enums/service.type.enum';

export interface LocalTmpStorageDragInfoInterface {
  serviceType: ServiceTypeEnum;
}

export interface LocalTmpStorageInterface {
  dragInfo: LocalTmpStorageDragInfoInterface;
  activePanel: PanelEnum;
}
