import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SplitterModule } from 'primeng/splitter';
import { HeaderComponent } from '../modules/header/header.component';
import { ServiceSwitchComponent } from '../modules/service/components/switch/service-switch.component';
import { PanelEnum } from './enums/panel.enum';
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
    ServiceSwitchComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  public get PanelEnum() {
    return PanelEnum;
  }

  public constructor(public readonly globalStorageService: GlobalStorageService) {}

  public ngOnInit() {
    this.globalStorageService.loadStorage();
  }
}
