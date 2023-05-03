import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ServiceTypeEnum } from '../enums/service.type.enum';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalDragButtonService extends StoreService<{ serviceType: ServiceTypeEnum }> {
  protected state: BehaviorSubject<{ serviceType: ServiceTypeEnum }> = new BehaviorSubject({ serviceType: null });

  public get getState() {
    return this.state.value;
  }

  public setState(serviceType: ServiceTypeEnum | null) {
    this.updateState({ serviceType });
  }
}
