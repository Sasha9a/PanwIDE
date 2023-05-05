import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PanelEnum } from '../../../../core/enums/panel.enum';
import { ServiceTypeEnum } from '../../../../core/enums/service.type.enum';
import { LocalPanelInterface } from '../../../../core/interfaces/local.storage.interface';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
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
  public panelInfo$: Observable<LocalPanelInterface>;

  public get ServiceTypeEnum() {
    return ServiceTypeEnum;
  }

  public constructor(public readonly localStorageService: LocalStorageService, private readonly cdRef: ChangeDetectorRef) {}

  public ngOnInit() {
    switch (this.panelType) {
      case PanelEnum.LEFT: {
        this.panelInfo$ = this.localStorageService.select((state) => state.leftPanel);
        this.panelInfo$.subscribe((panelInfo) => {
          this.activeService = panelInfo.activeService;
          this.cdRef.detectChanges();
        });
        break;
      }
      case PanelEnum.RIGHT: {
        this.panelInfo$ = this.localStorageService.select((state) => state.rightPanel);
        this.panelInfo$.subscribe((panelInfo) => {
          this.activeService = panelInfo.activeService;
          this.cdRef.detectChanges();
        });
        break;
      }
      case PanelEnum.BOTTOM: {
        this.panelInfo$ = this.localStorageService.select((state) => state.bottomPanel);
        this.panelInfo$.subscribe((panelInfo) => {
          this.activeService = panelInfo.activeService;
          this.cdRef.detectChanges();
        });
        break;
      }
    }
  }
}
