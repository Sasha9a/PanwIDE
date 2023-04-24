import { ServiceTypeEnum } from '../enums/service.type.enum';

export interface GlobalStorageInterface {
  openDirectory: string;
  leftPanel: {
    isShow: boolean;
    size: number;
    services: ServiceTypeEnum[];
    activeService: ServiceTypeEnum;
  };
  rightPanel: {
    isShow: boolean;
    size: number;
    services: ServiceTypeEnum[];
    activeService: ServiceTypeEnum;
  };
  bottomPanel: {
    isShow: boolean;
    size: number;
    services: ServiceTypeEnum[];
    activeService: ServiceTypeEnum;
  };
}
