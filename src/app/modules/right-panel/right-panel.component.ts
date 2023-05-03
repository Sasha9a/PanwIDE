import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DragDropModule } from 'primeng/dragdrop';
import { Observable } from 'rxjs';
import { PanelEnum } from '../../core/enums/panel.enum';
import { ServiceTypeEnum } from '../../core/enums/service.type.enum';
import { GlobalPanelInterface } from '../../core/interfaces/global.storage.interface';
import { GlobalDragButtonService } from '../../core/services/global-drag-button.service';
import { GlobalStorageService } from '../../core/services/global.storage.service';
import { ButtonServiceComponent } from '../../shared/dumbs/button-service/button-service.component';

@Component({
  selector: 'app-right-panel',
  standalone: true,
  imports: [CommonModule, DragDropModule, ButtonServiceComponent],
  templateUrl: './right-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RightPanelComponent implements OnInit {
  public rightPanel$: Observable<GlobalPanelInterface>;
  public dragService$: Observable<ServiceTypeEnum>;

  public get PanelEnum() {
    return PanelEnum;
  }

  public constructor(
    private readonly globalStorageService: GlobalStorageService,
    private readonly globalDragButtonService: GlobalDragButtonService
  ) {}

  public ngOnInit() {
    this.rightPanel$ = this.globalStorageService.select((state) => state.rightPanel);
    this.dragService$ = this.globalDragButtonService.select((state) => state.serviceType);
  }

  public dropService(panel: PanelEnum) {
    if (this.globalDragButtonService.getState?.serviceType) {
      this.globalStorageService.changeService(panel, this.globalDragButtonService.getState?.serviceType);
      this.globalDragButtonService.setState(null);
    }
  }
}
