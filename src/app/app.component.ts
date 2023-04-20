import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [CommonModule, InputNumberModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  public val = 0;
}
