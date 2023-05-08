import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SplitterModule } from 'primeng/splitter';
import { Observable } from 'rxjs';
import { HeaderComponent } from '../modules/header/header.component';
import { LeftPanelComponent } from '../modules/left-panel/left-panel.component';
import { RightPanelComponent } from '../modules/right-panel/right-panel.component';
import { ServiceSwitchComponent } from '../modules/service/components/switch/service-switch.component';
import { PanelEnum } from './enums/panel.enum';
import { LocalPanelInterface } from './interfaces/local.storage.interface';
import { GlobalStorageService } from './services/global.storage.service';
import { LocalStorageService } from './services/local-storage.service';
import { LocalTmpStorageService } from './services/local-tmp-storage.service';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SplitterModule,
    HeaderComponent,
    ServiceSwitchComponent,
    LeftPanelComponent,
    RightPanelComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  public leftPanel$: Observable<LocalPanelInterface>;
  public rightPanel$: Observable<LocalPanelInterface>;
  public bottomPanel$: Observable<LocalPanelInterface>;

  public get PanelEnum() {
    return PanelEnum;
  }

  public constructor(
    private readonly globalStorageService: GlobalStorageService,
    private readonly localStorageService: LocalStorageService,
    private readonly localTmpStorageService: LocalTmpStorageService
  ) {}

  public ngOnInit() {
    this.leftPanel$ = this.localStorageService.select((state) => state.leftPanel);
    this.rightPanel$ = this.localStorageService.select((state) => state.rightPanel);
    this.bottomPanel$ = this.localStorageService.select((state) => state.bottomPanel);

    this.globalStorageService.loadStorage();
  }

  public onResizeEndPanel(event: { originalEvent: MouseEvent; sizes: [number, number] }, panel: PanelEnum) {
    this.localStorageService.resizePanel(event.sizes, panel);
  }

  public clickToPanel(panel: PanelEnum) {
    this.localTmpStorageService.setActivePanel(panel);
  }
}
