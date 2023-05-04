import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { DragDropModule } from 'primeng/dragdrop';
import { TooltipModule } from 'primeng/tooltip';
import { Observable } from 'rxjs';
import { PanelEnum } from '../../../core/enums/panel.enum';
import { ServiceTypeEnum } from '../../../core/enums/service.type.enum';
import { GlobalPanelInterface } from '../../../core/interfaces/global.storage.interface';
import { GlobalDragButtonService } from '../../../core/services/global-drag-button.service';
import { GlobalStorageService } from '../../../core/services/global.storage.service';

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

  public panelInfo$: Observable<GlobalPanelInterface>;

  public readonly serviceInfo: Record<ServiceTypeEnum, { src: string; tooltip: string }> = {
    [ServiceTypeEnum.PROJECT]: {
      src: 'assets/icons/service/project.png',
      tooltip: '<p>Проект</p>'
    }
  };

  public constructor(
    private readonly globalDragButtonService: GlobalDragButtonService,
    private readonly globalStorageService: GlobalStorageService
  ) {}

  public ngOnInit() {
    const keyPanel = this.globalStorageService.convertPanelTypeToKey(this.panelType);
    this.panelInfo$ = this.globalStorageService.select((state) => state[keyPanel]);
  }

  public dragStart() {
    this.globalDragButtonService.setState(this.serviceType);
  }

  public dragEnd() {
    this.globalDragButtonService.setState(null);
  }
}
