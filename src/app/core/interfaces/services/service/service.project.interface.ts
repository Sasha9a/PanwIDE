import { ServiceProjectItemInterface } from '../../../../../../libs/interfaces/service.project.item.interface';

export interface ServiceProjectInterface {
  files: ServiceProjectItemInterface[];
  openedDirectory: string[];
  selectedItem: ServiceProjectItemInterface;
}
