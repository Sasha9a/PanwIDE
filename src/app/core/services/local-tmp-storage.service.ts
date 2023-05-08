import { ApplicationRef, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ServiceTypeEnum } from '../enums/service.type.enum';
import { LocalTmpStorageInterface } from '../interfaces/local.tmp.storage.interface';
import { localTmpStorageInitialState } from '../state/local.tmp.storage.initial.state';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root'
})
export class LocalTmpStorageService extends StoreService<LocalTmpStorageInterface> {
  protected state = new BehaviorSubject(localTmpStorageInitialState);

  public get getState() {
    return this.state.value;
  }

  public constructor(protected readonly appRef: ApplicationRef) {
    super(appRef);
  }

  public setDragInfo(dragInfo: { serviceType: ServiceTypeEnum }) {
    this.updateState({ dragInfo: { ...dragInfo } });
  }
}
