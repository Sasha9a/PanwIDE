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

  public constructor(private readonly electronService: ElectronService) {
    const userDataPath = this.electronService.remote.app.getPath('userData');
    let fullPath;
    if (userDataPath.includes('\\')) {
      fullPath = userDataPath + '\\localStorage.json';
    } else {
      fullPath = userDataPath + '/localStorage.json';
    }

    if (!this.electronService.fs.existsSync(fullPath)) {
      this.electronService.fs.openSync(fullPath, 'w+');
    }
    this.electronService.fs.readFile(fullPath, (err, data) => {
      if (err) {
        throw err;
      }
      console.log('--------- [File Data] ---------');
      console.log(data);
      console.log('--------- [File Data] ---------');
    });
  }

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
