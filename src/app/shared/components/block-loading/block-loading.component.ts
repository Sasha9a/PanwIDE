import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-block-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="absolute flex align-items-center justify-content-center w-full h-full z-5" style="background-color: rgba(0, 0, 0, 0.3)">
      <i class="pi pi-spin pi-spinner text-gray-300" style="font-size: 3rem"></i>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlockLoadingComponent {}
