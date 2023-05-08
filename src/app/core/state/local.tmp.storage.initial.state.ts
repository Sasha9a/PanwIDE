import { PanelEnum } from '../enums/panel.enum';
import { LocalTmpStorageInterface } from '../interfaces/local.tmp.storage.interface';

export const localTmpStorageInitialState: LocalTmpStorageInterface = {
  dragInfo: {
    serviceType: null
  },
  activePanel: PanelEnum.CENTER
};
