import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DragDropModule } from 'primeng/dragdrop';
import { Observable } from 'rxjs';
import { PanelEnum } from '../../core/enums/panel.enum';
import { LocalPanelInterface } from '../../core/interfaces/local.storage.interface';
import { LocalTmpStorageDragInfoInterface } from '../../core/interfaces/local.tmp.storage.interface';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { LocalTmpStorageService } from '../../core/services/local-tmp-storage.service';
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
  public dragInfo$: Observable<LocalTmpStorageDragInfoInterface>;

  public get PanelEnum() {
    return PanelEnum;
  }

  public constructor(
    private readonly localStorageService: LocalStorageService,
    private readonly localTmpStorageService: LocalTmpStorageService
  ) {}

  public ngOnInit() {
    this.rightPanel$ = this.localStorageService.select((state) => state.rightPanel);
    this.dragInfo$ = this.localTmpStorageService.select((state) => state.dragInfo);
  }

  public dropService(panel: PanelEnum, index: number) {
    const serviceType = this.localTmpStorageService.getState?.dragInfo?.serviceType;
    if (serviceType) {
      this.localStorageService.changeService(panel, serviceType, index);
      this.localTmpStorageService.setDragInfo({ serviceType: null });
    }
  }
}
