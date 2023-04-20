import {CommonModule} from "@angular/common";
import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'pawn-ide';
}
