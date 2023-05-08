import { ServiceTypeEnum } from '../enums/service.type.enum';

export interface LocalTmpStorageDragInfoInterface {
  serviceType: ServiceTypeEnum;
}

export interface LocalTmpStorageInterface {
  dragInfo: LocalTmpStorageDragInfoInterface;
}
