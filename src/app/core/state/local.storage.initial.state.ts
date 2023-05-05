import { ServiceTypeEnum } from '../enums/service.type.enum';
import { LocalStorageInterface } from '../interfaces/local.storage.interface';

export const localStorageInitialState: LocalStorageInterface = {
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
  },
  openedDirectories: []
};
