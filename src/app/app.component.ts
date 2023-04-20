import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SplitterModule } from 'primeng/splitter';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [CommonModule, SplitterModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {}
