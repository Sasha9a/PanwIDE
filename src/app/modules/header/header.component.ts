import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ElectronService } from '../../core/services/electron.service';
import { GlobalStorageService } from '../../core/services/global.storage.service';

@Component({
  standalone: true,
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  public get isMaximized(): boolean {
    return this.electronService.remote.getCurrentWindow().isMaximized();
  }

  public constructor(private readonly electronService: ElectronService, private readonly globalStorageService: GlobalStorageService) {}

  public closeProgram() {
    this.globalStorageService.updateStorage();
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
