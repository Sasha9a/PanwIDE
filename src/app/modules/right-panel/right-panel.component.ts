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
  selector: 'app-right-panel',
  standalone: true,
  imports: [CommonModule, DragDropModule, ButtonServiceComponent],
  templateUrl: './right-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RightPanelComponent implements OnInit {
  public rightPanel$: Observable<LocalPanelInterface>;
  public dragService$: Observable<ServiceTypeEnum>;

  public get PanelEnum() {
    return PanelEnum;
  }

  public constructor(
    private readonly localStorageService: LocalStorageService,
    private readonly globalDragButtonService: GlobalDragButtonService
  ) {}

  public ngOnInit() {
    this.rightPanel$ = this.localStorageService.select((state) => state.rightPanel);
    this.dragService$ = this.globalDragButtonService.select((state) => state.serviceType);
  }

  public dropService(panel: PanelEnum, index: number) {
    if (this.globalDragButtonService.getState?.serviceType) {
      this.localStorageService.changeService(panel, this.globalDragButtonService.getState?.serviceType, index);
      this.globalDragButtonService.setState(null);
    }
  }
}
