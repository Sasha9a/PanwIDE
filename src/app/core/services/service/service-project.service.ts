import { ApplicationRef, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ServiceProjectItemInterface } from '../../../../../libs/interfaces/service.project.item.interface';
import { ServiceProjectDialogInfoInterface, ServiceProjectInterface } from '../../interfaces/services/service/service.project.interface';
import { StoreService } from '../store.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceProjectService extends StoreService<ServiceProjectInterface> {
  protected state: BehaviorSubject<ServiceProjectInterface> = new BehaviorSubject<ServiceProjectInterface>({
    files: [],
    selectedItem: null,
    dialogInfo: {
      dialogType: null
    }
  });

  public get getState() {
    return this.state.value;
  }

  public constructor(protected readonly appRef: ApplicationRef) {
    super(appRef);
  }

  public setFiles(files: ServiceProjectItemInterface[]) {
    this.updateState({ files: [...files] });
  }

  public setSelectedItem(selectedItem: ServiceProjectItemInterface) {
    this.updateState({ selectedItem: { ...selectedItem } });
  }

  public setDialogInfo(dialogInfo: ServiceProjectDialogInfoInterface) {
    this.updateState({ dialogInfo: { ...dialogInfo } });
  }
}
