import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { PanelEnum } from '../../../core/enums/panel.enum';
import { ServiceTypeEnum } from '../../../core/enums/service.type.enum';
import { GlobalStorageService } from '../../../core/services/global.storage.service';
import { ServiceProjectComponent } from '../project/service-project.component';

@Component({
  standalone: true,
  selector: 'app-service-switch',
  templateUrl: './service-switch.component.html',
  imports: [CommonModule, ServiceProjectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceSwitchComponent implements OnInit {
  @Input() public panelType: PanelEnum;
  public activeService: ServiceTypeEnum;

  public get ServiceTypeEnum() {
    return ServiceTypeEnum;
  }

  public constructor(public readonly globalStorageService: GlobalStorageService) {}

  public ngOnInit() {
    switch (this.panelType) {
      case PanelEnum.LEFT: {
        this.activeService = this.globalStorageService.globalStorageInfo?.leftPanel?.activeService;
        break;
      }
      case PanelEnum.RIGHT: {
        this.activeService = this.globalStorageService.globalStorageInfo?.rightPanel?.activeService;
        break;
      }
      case PanelEnum.BOTTOM: {
        this.activeService = this.globalStorageService.globalStorageInfo?.bottomPanel?.activeService;
        break;
      }
    }
  }
}
