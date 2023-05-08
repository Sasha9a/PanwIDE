import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { DragDropModule } from 'primeng/dragdrop';
import { TooltipModule } from 'primeng/tooltip';
import { Observable } from 'rxjs';
import { PanelEnum } from '../../../core/enums/panel.enum';
import { ServiceTypeEnum } from '../../../core/enums/service.type.enum';
import { LocalPanelInterface } from '../../../core/interfaces/local.storage.interface';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { LocalTmpStorageService } from '../../../core/services/local-tmp-storage.service';

@Component({
  selector: 'app-button-service',
  standalone: true,
  imports: [CommonModule, TooltipModule, DragDropModule],
  templateUrl: './button-service.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonServiceComponent implements OnInit {
  @Input() public serviceType: ServiceTypeEnum;
  @Input() public panelType: PanelEnum;

  public panelInfo$: Observable<LocalPanelInterface>;
  public activePanel$: Observable<PanelEnum>;

  public readonly serviceInfo: Record<ServiceTypeEnum, { src: string; tooltip: string }> = {
    [ServiceTypeEnum.PROJECT]: {
      src: 'assets/icons/service/project.png',
      tooltip: '<p class="font-medium">Проект</p>'
    }
  };

  public constructor(
    private readonly localTmpStorageService: LocalTmpStorageService,
    private readonly localStorageService: LocalStorageService
  ) {}

  public ngOnInit() {
    const keyPanel = this.localStorageService.convertPanelTypeToKey(this.panelType);
    this.panelInfo$ = this.localStorageService.select((state) => state[keyPanel]);
    this.activePanel$ = this.localTmpStorageService.select((state) => state.activePanel);
  }

  public dragStart() {
    this.localTmpStorageService.setDragInfo({ serviceType: this.serviceType });
  }

  public dragEnd() {
    this.localTmpStorageService.setDragInfo({ serviceType: null });
  }

  public clickButton() {
    this.localStorageService.toggleService(this.serviceType);
  }
}
