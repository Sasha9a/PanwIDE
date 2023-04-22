import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SplitterModule } from 'primeng/splitter';
import { ElectronService } from './services/electron.service';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [CommonModule, HttpClientModule, FormsModule, ReactiveFormsModule, RouterModule, SplitterModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  public get isMaximized(): boolean {
    return this.electronService.remote.getCurrentWindow().isMaximized();
  }

  public constructor(private readonly electronService: ElectronService) {}

  public closeProgram() {
    this.electronService.remote.getCurrentWindow().close();
  }

  public hideProgram() {
    this.electronService.remote.getCurrentWindow().minimize();
  }

  public setFullScreenProgram() {
    this.electronService.remote.getCurrentWindow().maximize();
  }

  public setMinimizedProgram() {
    this.electronService.remote.getCurrentWindow().unmaximize();
  }
}
