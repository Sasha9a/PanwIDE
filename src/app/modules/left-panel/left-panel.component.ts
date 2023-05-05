import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DragDropModule } from 'primeng/dragdrop';
import { Observable } from 'rxjs';
import { PanelEnum } from '../../core/enums/panel.enum';
import { ServiceTypeEnum } from '../../core/enums/service.type.enum';
import { LocalPanelInterface } from '../../core/interfaces/local.storage.interface';
import { GlobalDragButtonService } from '../../core/services/global-drag-button.service';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { ButtonServiceComponent } from '../../shared/dumbs/button-service/button-service.component';

@Component({
  selector: 'app-left-panel',
  standalone: true,
  imports: [CommonModule, DragDropModule, ButtonServiceComponent],
  templateUrl: './left-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeftPanelComponent implements OnInit {
  public leftPanel$: Observable<LocalPanelInterface>;
  public bottomPanel$: Observable<LocalPanelInterface>;
  public dragService$: Observable<ServiceTypeEnum>;

  public get PanelEnum() {
    return PanelEnum;
  }

  public constructor(
    private readonly localStorageService: LocalStorageService,
    private readonly globalDragButtonService: GlobalDragButtonService
  ) {}

  public ngOnInit() {
    this.leftPanel$ = this.localStorageService.select((state) => state.leftPanel);
    this.bottomPanel$ = this.localStorageService.select((state) => state.bottomPanel);
    this.dragService$ = this.globalDragButtonService.select((state) => state.serviceType);
  }

  public dropService(panel: PanelEnum, index: number) {
    if (this.globalDragButtonService.getState?.serviceType) {
      this.localStorageService.changeService(panel, this.globalDragButtonService.getState?.serviceType, index);
      this.globalDragButtonService.setState(null);
    }
  }
}
