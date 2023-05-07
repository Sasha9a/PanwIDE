import { ServiceProjectItemInterface } from '../../../../../../libs/interfaces/service.project.item.interface';
import { ServiceProjectDialogTypeEnum } from '../../../../modules/service/enums/service.project.dialog.type.enum';

export interface ServiceProjectDialogInfoInterface {
  dialogType: ServiceProjectDialogTypeEnum;
}

export interface ServiceProjectInterface {
  files: ServiceProjectItemInterface[];
  selectedItem: ServiceProjectItemInterface;
  dialogInfo: ServiceProjectDialogInfoInterface;
}
