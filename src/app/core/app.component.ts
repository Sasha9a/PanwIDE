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
import { GlobalPanelInterface } from './interfaces/global.storage.interface';
import { GlobalStorageService } from './services/global.storage.service';

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
  public leftPanel$: Observable<GlobalPanelInterface>;
  public rightPanel$: Observable<GlobalPanelInterface>;
  public bottomPanel$: Observable<GlobalPanelInterface>;

  public get PanelEnum() {
    return PanelEnum;
  }

  public constructor(public readonly globalStorageService: GlobalStorageService) {}

  public ngOnInit() {
    this.leftPanel$ = this.globalStorageService.select((state) => state.leftPanel);
    this.rightPanel$ = this.globalStorageService.select((state) => state.rightPanel);
    this.bottomPanel$ = this.globalStorageService.select((state) => state.bottomPanel);

    this.globalStorageService.loadStorage();
  }

  public onResizeEndPanel(event: { originalEvent: MouseEvent; sizes: [number, number] }, panel: PanelEnum) {
    this.globalStorageService.resizePanel(event.sizes, panel);
  }
}
