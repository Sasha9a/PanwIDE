import { ApplicationRef } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, map } from 'rxjs';

export class StoreService<StoreType> {
  protected state: BehaviorSubject<StoreType>;

  public constructor(protected readonly appRef: ApplicationRef) {}

  public select<T>(predicate: (state: StoreType) => T) {
    return this.state.asObservable().pipe(map(predicate), distinctUntilChanged());
  }

  protected updateState(predicate: ((state: StoreType) => Partial<StoreType>) | Partial<StoreType>) {
    if (typeof predicate === 'function') {
      this.state.next({ ...this.state.value, ...predicate(this.state.value) });
    } else {
      this.state.next({ ...this.state.value, ...predicate });
    }
    this.appRef.tick();
  }
}
