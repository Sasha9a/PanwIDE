import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SplitterModule } from 'primeng/splitter';
import { HeaderComponent } from '../modules/header/header.component';
import { GlobalStorageService } from './services/global.storage.service';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [CommonModule, HttpClientModule, FormsModule, ReactiveFormsModule, RouterModule, SplitterModule, HeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  public constructor(private readonly globalStorageService: GlobalStorageService) {}

  public ngOnInit() {
    this.globalStorageService.loadStorage();
  }
}
